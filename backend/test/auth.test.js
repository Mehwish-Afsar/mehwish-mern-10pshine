const request = require("supertest");
const app = require("../app");
const { expect } = require("chai");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

describe("Auth API Tests", () => {
  const testUser = {
    fullName: "Mehwish Afsar",
    email: "mehwish_test@gmail.com",
    password: "123456",
  };

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should create a new user account", async () => {
    const res = await request(app).post("/create-account").send(testUser);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accessToken");
    expect(res.body.error).to.be.false;
  });

  it("should not allow duplicate registration", async () => {
    await request(app).post("/create-account").send(testUser);
    const res = await request(app).post("/create-account").send(testUser);
    expect(res.status).to.equal(400);
    expect(res.body.error).to.be.true;
  });

  it("should login successfully", async () => {
    await request(app).post("/create-account").send(testUser);
    const res = await request(app).post("/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accessToken");
    expect(res.body.error).to.be.false;
  });

it("should send a forgot password link", async function() {
  this.timeout(5000); 

  await User.create({
    fullName: "Forgot Test",
    email: "forgot_test@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });

  const res = await request(app)
    .post("/forgot-password")
    .send({ email: "forgot_test@gmail.com" });

  expect(res.status).to.equal(200);
  expect(res.body.message).to.include("Password reset link sent");
});


  it("should reset password with a valid token", async () => {
    // Create a user first
    const user = await User.create({
      fullName: "Reset Test",
      email: "reset_test@gmail.com",
      password: await bcrypt.hash("123456", 10),
    });
    const userId = user._id;

    // Generate reset token
    const resetToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const res = await request(app)
      .post(`/reset-password/${resetToken}`)
      .send({ password: "newpassword123" });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.include("Password updated successfully");

    // Verify password was updated
    const updatedUser = await User.findById(userId);
    const match = await bcrypt.compare("newpassword123", updatedUser.password);
    expect(match).to.be.true;
  });
});
