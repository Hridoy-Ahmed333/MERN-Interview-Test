const express = require("express");
const whiteboardController = require("../controller/whiteboard");
const whiteboarRouter = express.Router();
whiteboarRouter
  .post("/", whiteboardController.createWhiteboard)
  .get("/", whiteboardController.getAllWhiteboard)
  .get("/:id", whiteboardController.GetOneWhiteboard)
  .put("/:id", whiteboardController.updateWhiteboard)
  .delete("/:id", whiteboardController.deleteWhiteboard);
exports.whiteboarRouter = whiteboarRouter;
