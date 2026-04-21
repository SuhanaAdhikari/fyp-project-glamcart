const mongoose = require("mongoose");
const CONNECTION_TIMEOUT_MS = 15000;

const buildConnectionError = (error) => {
  if (error?.code === "ENOTFOUND" || /querySrv ENOTFOUND/i.test(error?.message || "")) {
    return new Error(
      "MongoDB hostname from DB_URL could not be resolved. Update backend/config/.env with the current MongoDB Atlas connection string."
    );
  }

  return error;
};

const connectDatabase = async () => {
  const connectionString = process.env.DB_URL || process.env.MONGODB_URI;
  let timeoutId;

  if (!connectionString) {
    throw new Error(
      "MongoDB connection string is missing. Set DB_URL in backend/config/.env before starting the backend."
    );
  }

  try {
    const pendingConnection = mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT_MS,
    });

    // Ensure startup fails quickly even if DNS resolution hangs before MongoDB
    // server selection finishes.
    pendingConnection.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new Error(
            "Timed out while connecting to MongoDB. Verify DB_URL in backend/config/.env and confirm the Atlas hostname is valid from this machine."
          )
        );
      }, CONNECTION_TIMEOUT_MS);
    });

    const data = await Promise.race([pendingConnection, timeoutPromise]);
    clearTimeout(timeoutId);

    console.log(`MongoDB connected: ${data.connection.host}`);
    return data;
  } catch (error) {
    throw buildConnectionError(error);
  } finally {
    clearTimeout(timeoutId);
  }
};

module.exports = connectDatabase;
