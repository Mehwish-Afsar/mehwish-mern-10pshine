const request = require("supertest");
const app = require("../app");
const { expect } = require("chai");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

describe("User API Tests", () => {
  let token, userId;

  beforeEach(async () => {
    await User.deleteMany({});

    const user = await User.create({
      fullName: "Profile Test",
      email: "profile_test@gmail.com",
      password: await bcrypt.hash("123456", 10),
    });

    userId = user._id;
    token = jwt.sign(
      { user: { _id: userId, email: user.email } },
      process.env.ACCESS_TOKEN_SECRET
    );
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should get current user info", async () => {
    const res = await request(app)
      .get("/get-user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property("email", "profile_test@gmail.com");
    expect(res.body.user).to.have.property("fullName", "Profile Test");
  });

  it("should change password", async () => {
    const res = await request(app)
      .put("/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "123456", newPassword: "newpass123" });

    expect(res.status).to.equal(200);
    expect(res.body.error).to.be.false;
  });

  it("should update user profile (fullName only)", async () => {
    const res = await request(app)
      .put("/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .field("fullName", "Updated Name");

    expect(res.status).to.equal(200);
    expect(res.body.user.fullName).to.equal("Updated Name");
    expect(res.body.error).to.be.false;
  });

  it("should update user profile (without image)", async () => {
  const user = await User.create({
    fullName: "Old Name",
    email: "image_test@gmail.com",
    password: await bcrypt.hash("123456", 10),
  });

  const token = jwt.sign({ user: { _id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET);

  const res = await request(app)
    .put("/update-profile")
    .set("Authorization", `Bearer ${token}`)
    .send({ fullName: "New Name" });

  expect(res.status).to.equal(200);
  expect(res.body.user.fullName).to.equal("New Name");
});

});
