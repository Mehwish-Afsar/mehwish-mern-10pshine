require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./logger");
const app = require("./app");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  logger.error("MONGO_URI is not set. Add it to your environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

// Render assigns the port dynamically via process.env.PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
