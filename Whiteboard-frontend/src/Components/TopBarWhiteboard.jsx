import { useMutation } from "@tanstack/react-query";
import { addWhiteboard, updateWhiteboard } from "../API/whiteboardApi";
import toast from "react-hot-toast";

function TopBarWhiteboard({
  choosed,
  handleClear,
  handleDelete,
  handleText,
  handleUpdate,
  redoHandle,
  undoHandle,
  fillColor,
  setColor,
  fontSize,
  setFontSize,
  color,
  strokeWidth,
  setStrokeWidth,
  setFillColor,
  elements,
  setChoosed,
  isSaved,
  setIsSaved,
  setSaveBox,
  saveBox,
  name,
}) {
  const handleClickAdd = () => {
    setSaveBox(true);
  };

  const { mutate: updateMutation, isLoading: isUpdating } = useMutation({
    mutationFn: (storedId) => updateWhiteboard(storedId, elements, name),
    onSuccess: (data) => {
      toast.success("Whiteboard updated successfully");
      setIsSaved(true);
    },
    onError: (error) => {
      toast.error(`Failed to update whiteboard: ${error.message}`);
    },
  });

  const handleClickUpdate = () => {
    const storedId = localStorage.getItem("id");

    if (!storedId) {
      console.error("No ID found in localStorage");
      return;
    }

    updateMutation(storedId);
  };

  return (
    <div>
      <div className="top-bar">
        <div className="edit">
          {choosed?.type === "text" && (
            <div className="update-box">
              <button onClick={() => setChoosed(null)}>Cancel</button>
              <div>
                <label>Font Size</label>
                <input
                  type="text"
                  value={fontSize}
                  onChange={(e) => setFontSize(+e.target.value)}
                  className="inp-fontSize"
                />
              </div>
              <div>
                <label>Pick Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="inp-color"
                />
              </div>
              <button onClick={handleUpdate}>Update</button>
            </div>
          )}
          {(choosed?.type === "line" ||
            choosed?.type === "stLine" ||
            choosed?.type === "arrow") && (
            <div className="update-box">
              <div>
                <label>Line Width</label>
                <input
                  type="text"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(+e.target.value)}
                  className="inp-fontSize"
                />
              </div>
              <div>
                <label>Stroke Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="inp-color"
                />
              </div>
              <button onClick={handleUpdate}>Update</button>
            </div>
          )}
          {(choosed?.type === "rect" || choosed?.type === "circle") && (
            <div className="update-box">
              <div>
                <label>Border Width</label>
                <input
                  type="text"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(+e.target.value)}
                  className="inp-fontSize"
                />
              </div>
              <div>
                <label>Stroke Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="inp-color"
                />
              </div>
              <div>
                <label>Fill Color</label>
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="inp-color"
                />
              </div>
              <button onClick={handleUpdate}>Update</button>
            </div>
          )}
        </div>
        <div className="update-box">
          <button onClick={undoHandle}>Undo</button>
          <button onClick={redoHandle}>Redo</button>
          <button onClick={handleClear}>Clear Whiteboard</button>
          {choosed && <button onClick={handleDelete}>Delete</button>}
          {elements.length > 0 && !isSaved && !saveBox && (
            <button
              style={{ backgroundColor: "green" }}
              onClick={handleClickAdd}
            >
              Save
            </button>
          )}
          {elements.length > 0 && isSaved && !saveBox && (
            <button
              style={{ backgroundColor: "green" }}
              onClick={handleClickUpdate}
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBarWhiteboard;
