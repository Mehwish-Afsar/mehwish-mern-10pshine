const mongoose = require("mongoose");
const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

before(async function() {
  this.timeout(10000); 
  const testDB = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/notes_test";
  await mongoose.connect(testDB);
  console.log("Test DB connected");
});

after(async function() {
  this.timeout(10000);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log("Test DB disconnected");
});
