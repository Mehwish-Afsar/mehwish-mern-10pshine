const mongoose = require("mongoose");
const config = require("./config.json");
const logger = require("./logger");
const app = require("./app");

mongoose
  .connect(config.connectionString)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error(err));

const PORT = 8000;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
