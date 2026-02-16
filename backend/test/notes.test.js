const request = require("supertest");
const app = require("../app");
const { expect } = require("chai");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

describe("Notes API Tests", () => {
  let token, userId, noteId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});

    // Create a test user
    const user = await User.create({
      fullName: "Mehwish",
      email: "notes_test@gmail.com",
      password: await bcrypt.hash("123456", 10),
    });
    userId = user._id;

    // Generate JWT token
    token = jwt.sign({ user: { _id: userId, email: user.email } }, process.env.ACCESS_TOKEN_SECRET);

    // Create a note for search & pin tests
    const note = await Note.create({
      title: "Pin Test",
      content: "This is pinned",
      userId,
    });
    noteId = note._id;
  });

  it("should add a new note", async () => {
    const res = await request(app)
      .post("/add-notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Note", content: "This is a note." });

    expect(res.status).to.equal(200);
    expect(res.body.note).to.have.property("title", "Test Note");
    expect(res.body.error).to.be.false;
  });

  it("should edit a note", async () => {
    const note = await Note.create({ title: "Old", content: "Old", userId });
    const res = await request(app)
      .put(`/edit-notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated" });

    expect(res.status).to.equal(200);
    expect(res.body.note.title).to.equal("Updated");
    expect(res.body.error).to.be.false;
  });

  it("should delete a note", async () => {
    const note = await Note.create({ title: "To Delete", content: "Delete", userId });
    const res = await request(app)
      .delete(`/delete-note/${note._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.error).to.be.false;
  });

  it("should search notes by title or content", async () => {
    const res = await request(app)
      .get(`/search-notes`)
      .set("Authorization", `Bearer ${token}`)
      .query({ query: "Pin" });

    expect(res.status).to.equal(200);
    expect(res.body.notes).to.have.lengthOf(1);
    expect(res.body.notes[0].title).to.equal("Pin Test");
  });

  it("should update note pin status", async () => {
    const res = await request(app)
      .put(`/update-note-pinned/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isPinned: true });

    expect(res.status).to.equal(200);
    expect(res.body.note.isPinned).to.be.true;
    expect(res.body.error).to.be.false;
  });

  it("should get all notes", async () => {
    const res = await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.notes).to.have.length.greaterThan(0);
    expect(res.body.error).to.be.false;
  });

});
