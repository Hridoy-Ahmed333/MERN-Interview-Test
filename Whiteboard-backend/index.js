const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const whiteboarRouter = require("./routes/whiteboard");

const server = express();

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DATABASE_CONNECTION);
  console.log("Connected with database");
}

server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(morgan("combined"));
server.use(express.static("public"));

server.use("/", whiteboarRouter.whiteboarRouter);

server.listen(8080, () => {
  console.log("Server started on port number 8080");
});
