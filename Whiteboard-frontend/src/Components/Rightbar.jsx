import { IoText } from "react-icons/io5";
import { GiCardPickup } from "react-icons/gi";
import { FaEdit } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
function Rightbar({
  setTool,
  setColor,
  color,
  setFillColor,
  fillColor,
  setResizing,
  tool,
}) {
  return (
    <div>
      <div className="right-bar">
        <div className="rightbar-col">
          {" "}
          <div
            className={`elements ${tool === "arrow" && "active"}`}
            onClick={() => setTool("arrow")}
          >
            <div className="icon">
              <img src="/Arrow.drawio.png" alt="arrow" />
            </div>
            <div>Arrow</div>
          </div>
          <div
            className={`elements ${tool === "circle" && "active"}`}
            onClick={() => setTool("circle")}
          >
            <div className="icon2">
              <FaRegCircle size={36} />
            </div>
            <div>Circle</div>
          </div>
          <div
            className={`elements ${tool === "line" && "active"}`}
            onClick={() => setTool("line")}
          >
            <div className="icon">
              <img src="/Path.drawio.png" alt="line" />
            </div>
            <div>Line</div>
          </div>
          <div
            className={`elements ${tool === "stLine" && "active"}`}
            onClick={() => setTool("stLine")}
          >
            <div className="icon">
              <img src="./Line.drawio.png" alt="path" />
            </div>
            <div className=".name">
              <span>Straight Line</span>
            </div>
          </div>
          <div
            className={`elements ${tool === "rect" && "active"}`}
            onClick={() => setTool("rect")}
          >
            <div className="icon">
              {" "}
              <img src="/rect.drawio.png" alt="rectangle" />
            </div>
            <div>Rectangle</div>
          </div>
          <div
            className={`elements ${tool === "text" && "active"}`}
            onClick={() => setTool("text")}
          >
            <div className="icon2">
              <IoText size={36} />
            </div>
            <div>Text</div>
          </div>
        </div>
        <div className="rightbar-col">
          <div
            className={`elements ${tool === "" && "active"}`}
            onClick={() => {
              setTool("");
              setResizing(false);
            }}
          >
            <div className="icon2">
              <GiCardPickup size={50} />
            </div>
            <div>Select</div>
          </div>
          <div
            className={`elements ${tool === "edit" && "active"}`}
            onClick={() => setTool("edit")}
          >
            <div className="icon2">
              <FaEdit size={36} />
            </div>
            <div>Edit</div>
          </div>
          <div className="elements">
            <div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-picker-div"
              />
              <div className="element-color">Stroke Color</div>
            </div>
          </div>
          <div className="elements">
            <div>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="color-picker-div"
              />
              <div className="element-color">Fill Color</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rightbar;
