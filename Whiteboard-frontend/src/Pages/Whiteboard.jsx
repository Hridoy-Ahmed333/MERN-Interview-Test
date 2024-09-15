import { useEffect, useState } from "react";
import WhiteboardComp from "../Components/WhiteboardComp";
import "./Whiteboard.css";
import TopBarWhiteboard from "../Components/TopBarWhiteboard";
import Rightbar from "../Components/Rightbar";
import { useLocation } from "react-router-dom";
import { addWhiteboard, getWhiteboardById } from "../API/whiteboardApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Whiteboard() {
  const { state } = useLocation();
  const [tool, setTool] = useState("");
  const [choosed, setChoosed] = useState(null);
  const [textInitail, setTextInitial] = useState("");
  const [elements, setElements] = useState([]);
  const [color, setColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [resizing, setResizing] = useState(false);
  const [fontSize, setFontSize] = useState(10);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [history, setHistory] = useState([]);
  const [text, setText] = useState("");
  const [openTextBar, setOpenTextBar] = useState(false);
  const [textElement, setTextElement] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveBox, setSaveBox] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    let mounted = true;
    const handleBeforeUnload = (e) => {
      if (mounted && window.localStorage) {
        localStorage.clear();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      mounted = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const id = state?.id;
      if (id) {
        try {
          localStorage.setItem("id", id);
          const data = await getWhiteboardById(id);
          setIsSaved(true);
          setElements(data.shapes);
          setName(data.name);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [state?.id, isSaved]);

  useEffect(() => {
    if (choosed) {
      if (choosed.type === "text") {
        setColor(choosed.fill);
        setFontSize(choosed.fontSize);
        setText(choosed.text);
      }
      if (
        choosed.type === "stLine" ||
        choosed.type === "arrow" ||
        choosed.type === "line"
      ) {
        setStrokeWidth(choosed.strokeWidth);
        setColor(choosed.stroke);
      }
      if (choosed.type === "rect" || choosed.type === "circle") {
        setStrokeWidth(choosed.strokeWidth);
        setColor(choosed.stroke);
        setFillColor(choosed.fill);
      }
    }
  }, [choosed]);

  function undoHandle() {
    if (elements.length > 0) {
      const elementToUndo = elements[elements.length - 1];
      setHistory((pre) => [...pre, elementToUndo]);
      setElements((pre) => pre.slice(0, pre.length - 1));
    }
  }

  function redoHandle() {
    if (history.length > 0) {
      const elementToRedo = history[history.length - 1];
      setElements((pre) => [...pre, elementToRedo]);
      setHistory((pre) => pre.slice(0, history.length - 1));
    }
  }
  function handleClear() {
    setElements([]);
  }
  function handleDelete() {
    const index = elements.findIndex((el) => choosed?.id === el?.id);
    const newArray = [
      ...elements.slice(0, index),
      ...elements.slice(index + 1),
    ];
    setElements(newArray);
  }

  function update(elm) {
    const index = elements.findIndex((el) => choosed?.id === el?.id);
    const newArray = [
      ...elements.slice(0, index),
      elm,
      ...elements.slice(index + 1),
    ];
    setElements(newArray);
  }

  function handleText() {
    const element = elements.find((el) => choosed.id === el.id);
    const elm = { ...element, text, width: text.length * 10 + 20 };
    console.log(text);
    update(elm);
    setText("");
    setChoosed(null);
  }

  function handleUpdate() {
    const element = elements.find((el) => choosed?.id === el?.id);

    if (element?.type === "text") {
      const elm = {
        ...element,
        fontSize,
        fill: color,
      };
      update(elm);
    }
    if (
      choosed.type === "stLine" ||
      choosed.type === "arrow" ||
      choosed.type === "line"
    ) {
      console.log(choosed?.id);
      const elm = { ...element, strokeWidth, stroke: color };

      update(elm);
    }
    if (choosed.type === "rect" || choosed.type === "circle") {
      const elm = { ...element, strokeWidth, stroke: color, fill: fillColor };

      update(elm);
    }

    setChoosed(null);
    setColor("#000000");
    setFontSize(10);
    setStrokeWidth(4);
    setFillColor("#ffffff");
  }

  function addText(textElement) {
    console.log(textElement);
    setElements([...elements, textElement]);
    setTool(null);
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: addWhiteboard,
    onSuccess: (data) => {
      localStorage.setItem("id", data._id);
      toast.success("Successfylly added the data");
      setIsSaved(true);
    },
    onError: (error) => {
      toast.error(`Cannot submit the data because of ${error}`);
    },
  });

  function AddName() {
    setSaveBox(false);
    console.log(name);
    const currentName = name;
    mutate({ elements, currentName });
  }
  function NameCancle() {
    setIsSaved(false);
    setSaveBox(false);
  }
  return (
    <div className="whiteboard-page-container">
      <TopBarWhiteboard
        choosed={choosed}
        handleClear={handleClear}
        handleDelete={handleDelete}
        handleText={handleText}
        handleUpdate={handleUpdate}
        redoHandle={redoHandle}
        undoHandle={undoHandle}
        fillColor={fillColor}
        setColor={setColor}
        fontSize={fontSize}
        setFontSize={setFontSize}
        color={color}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        setFillColor={setFillColor}
        elements={elements}
        setChoosed={setChoosed}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        setSaveBox={setSaveBox}
        saveBox={saveBox}
        name={name}
      />
      {choosed?.type === "text" && tool !== "text" && (
        <div className="inputBox">
          <input
            className="txt-area"
            type="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="add-btn" onClick={handleText}>
            Add Text
          </button>
        </div>
      )}
      {tool === "text" && (
        <div className="inputBox">
          <div>Font Size</div>
          <input
            className="fnt"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
          <input
            className="txt-area"
            type="textarea"
            value={textInitail}
            onChange={(e) => setTextInitial(e.target.value)}
          />
          <button className="add-btn" onClick={() => setTool(null)}>
            Cancel
          </button>
        </div>
      )}
      {saveBox && (
        <div className="inputBox">
          <input
            className="txt-area"
            type="textarea"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="add-btn" onClick={() => AddName()}>
            Add
          </button>
          <button className="add-btn" onClick={() => NameCancle()}>
            Cancel
          </button>
        </div>
      )}
      <div className="whiteboard-body-container">
        <Rightbar
          setTool={setTool}
          setColor={setColor}
          color={color}
          setFillColor={setFillColor}
          fillColor={fillColor}
          setResizing={setResizing}
          tool={tool}
        />
        <div className="white-board-container">
          <WhiteboardComp
            tool={tool}
            setTool={setTool}
            elements={elements}
            setElements={setElements}
            choosed={choosed}
            setChoosed={setChoosed}
            color={color}
            fillColor={fillColor}
            resizing={resizing}
            setResizing={setResizing}
            fontSize={fontSize}
            strokeWidth={strokeWidth}
            textInitail={textInitail}
            setTextInitial={setTextInitial}
            openTextBar={openTextBar}
            setOpenTextBar={setOpenTextBar}
            setTextElement={setTextElement}
            addText={addText}
          />
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
