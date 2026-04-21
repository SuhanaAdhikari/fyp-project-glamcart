const path = require("path");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: path.join(__dirname, "config", ".env"),
  });
}

const supportedNodeMajors = new Set([18, 20]);
const currentNodeMajor = Number(process.versions.node.split(".")[0]);

if (!supportedNodeMajors.has(currentNodeMajor)) {
  console.warn(
    `Warning: backend dependencies are configured for Node 18.x and tested with Node 18/20. Current runtime ${process.version} may cause compatibility issues.`
  );
}

const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
let server;

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error(`shutting down the server for handling uncaught exception`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    return;
  }

  process.exit(1);
});

const startServer = async () => {
  await connectDatabase();

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const port = process.env.PORT || 8000;

  server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error(`Shutting down the server for ${err.message}`);
  console.error(`shutting down the server for unhandle promise rejection`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    return;
  }

  process.exit(1);
});

startServer().catch((err) => {
  console.error(`Error: ${err.message}`);
  console.error(`shutting down the server during startup`);
  process.exit(1);
});
