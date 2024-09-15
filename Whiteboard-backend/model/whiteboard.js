const mongoose = require("mongoose");
const { Schema } = mongoose;

const shapeSchema = new Schema({
  id: String,
  points: [],
  stroke: String,
  strokeWidth: Number,
  type: String,
  x: Number,
  y: Number,
  fill: String,
  height: Number,
  fontSize: String,
  width: Number,
  radius: Number,
  text: String,
});

const whiteboardSchema = new Schema({
  date: { type: Date },
  name: String,
  shapes: [shapeSchema],
});
exports.Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);
