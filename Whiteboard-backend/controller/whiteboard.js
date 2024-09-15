const model = require("../model/whiteboard");
const Whiteboard = model.Whiteboard;

exports.createWhiteboard = async (req, res) => {
  const newWhiteBoard = new Whiteboard({
    ...req.body,
    date: Date.now(),
  });

  try {
    const output = await newWhiteBoard.save();
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

exports.getAllWhiteboard = async (req, res) => {
  try {
    const whiteboard = await Whiteboard.find();
    console.log(req.body);
    res.status(201).json(whiteboard);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.GetOneWhiteboard = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const whiteboard = await Whiteboard.findById(id);
    res.status(201).json(whiteboard);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.updateWhiteboard = async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  try {
    const whiteboard = await Whiteboard.findOneAndReplace(
      { _id: id },
      { ...req.body, date: Date.now() },
      {
        new: true,
      }
    );
    res.status(201).json(whiteboard);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.deleteWhiteboard = async (req, res) => {
  const id = req.params.id;
  try {
    const whiteboard = await Whiteboard.findOneAndDelete({ _id: id });
    res.status(201).json(whiteboard);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
