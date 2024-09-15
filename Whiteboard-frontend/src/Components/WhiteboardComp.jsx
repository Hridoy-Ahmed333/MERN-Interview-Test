import { useEffect, useRef, useState } from "react";
import "./Whiteboard.css";
import { Stage, Layer, Rect, Text, Circle, Line, Arrow } from "react-konva";

function WhiteboardComp({
  tool,
  elements,
  setElements,
  choosed,
  setChoosed,
  color,
  fillColor,
  resizing,
  setResizing,
  fontSize,
  strokeWidth,
  textInitail,
  setTextInitial,
  openTextBar,
  setOpenTextBar,
  setTextElement,
  addText,
}) {
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);

  const [selectedElement, setSelectedElement] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setStageSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const handleDragStart = (e) => {
    const id = e.target.id();

    setElements(
      elements.map((el) => ({
        ...el,
        isDragging: el?.id === id,
      }))
    );
  };

  const handleDragMove = (e) => {
    const id = e.target.id();
    const element = elements.find((el) => el?.id === id);

    if (!element) return;

    let { x, y } = e.target.position();

    if (
      element.type === "line" ||
      element.type === "stLine" ||
      element.type === "arrow"
    ) {
      const newPoints = element.points.map((point, index) => {
        return index % 2 === 0 ? point : point;
      });

      setElements(
        elements.map((el) => {
          if (el?.id === id) {
            return {
              ...el,
              x,
              y,
              points: newPoints,
            };
          }
          return el;
        })
      );
    } else {
      const stageWidth = window.innerWidth;
      const stageHeight = window.innerHeight;

      if (element.type === "circle") {
        x = Math.max(element.radius, Math.min(x, stageWidth - element.radius));
        y = Math.max(element.radius, Math.min(y, stageHeight - element.radius));
      } else {
        x = Math.max(0, Math.min(x, stageWidth - element.width));
        y = Math.max(0, Math.min(y, stageHeight - element.height));
      }

      e.target.position({ x, y });

      setElements(
        elements.map((el) => {
          if (el.id === id) {
            return {
              ...el,
              x,
              y,
            };
          }
          return el;
        })
      );
    }
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const { x, y } = e.target.position();
    setElements(
      elements.map((el) => {
        if (el?.id === id) {
          return {
            ...el,
            x,
            y,
            isDragging: false,
          };
        }
        return el;
      })
    );
  };

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const id = e.target.id();
    const element = elements?.find((el) => el?.id === id);
    if (tool === "") {
      setChoosed(element);
    }

    if (tool === "rect" || tool === "circle") {
      setDrawing(true);
      setCurrentShape({
        type: tool,
        x,
        y,
        id: `shape_${Date.now()}`,
        strokeWidth: strokeWidth,
        stroke: color,
        fill: fillColor,
      });
    } else if (tool === "line" || tool === "stLine" || tool === "arrow") {
      setDrawing(true);
      setCurrentShape({
        type: tool,
        x,
        y,
        id: `shape_${Date.now()}`,
        stroke: color,
        strokeWidth: strokeWidth,
        points: [0, 0, 0, 0],
      });
    } else if (tool === "text") {
      // const text = prompt("Enter your text:");

      //console.log(textInitail);

      if (textInitail) {
        const textElement = {
          type: "text",
          id: `text_${Date.now()}`,
          text: textInitail,
          x,
          y,
          fontSize: fontSize,
          fill: color,
          width: textInitail.length * 10 + 20,
          height: 30,
        };
        // setElements([...elements, textElement]);
        //setTextElement(textElement);
        addText(textElement);
      }
    } else if (tool === "edit") {
      const element = elements.find(
        (el) =>
          (el.type === "rect" && isOnRectBorder(el, x, y)) ||
          (el.type === "circle" && isOnCircleBorder(el, x, y)) ||
          (el.type === "text" && isOnRectBorder(el, x, y)) // Allow text selection
      );
      if (element) {
        setSelectedElement(element);
        setResizing(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;

    if (drawing && currentShape) {
      const { x: startX, y: startY } = currentShape;

      if (currentShape.type === "rect" || currentShape.type === "circle") {
        let endX = x;
        let endY = y;

        endX = Math.max(0, Math.min(endX, stageWidth));
        endY = Math.max(0, Math.min(endY, stageHeight));

        const newShape = {
          ...currentShape,
          width:
            currentShape.type === "rect" ? Math.abs(endX - startX) : undefined,
          height:
            currentShape.type === "rect" ? Math.abs(endY - startY) : undefined,
          radius:
            currentShape.type === "circle"
              ? Math.sqrt(
                  Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
                )
              : undefined,
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
        };

        if (currentShape.type === "rect") {
          newShape.width = Math.min(newShape.width, stageWidth - newShape.x);
          newShape.height = Math.min(newShape.height, stageHeight - newShape.y);
        } else if (currentShape.type === "circle") {
          const maxRadiusX = Math.min(
            currentShape.x,
            stageWidth - currentShape.x
          );
          const maxRadiusY = Math.min(
            currentShape.y,
            stageHeight - currentShape.y
          );
          newShape.radius = Math.min(newShape.radius, maxRadiusX, maxRadiusY);
        }

        setCurrentShape(newShape);
      } else if (
        currentShape.type === "line" ||
        currentShape.type === "stLine" ||
        currentShape.type === "arrow"
      ) {
        const relativeX = x - startX;
        const relativeY = y - startY;

        if (currentShape.type === "line") {
          setCurrentShape({
            ...currentShape,
            points: [...currentShape.points, relativeX, relativeY],
          });
        } else if (
          currentShape.type === "stLine" ||
          currentShape.type === "arrow"
        ) {
          setCurrentShape({
            ...currentShape,
            points: [
              currentShape.points[0],
              currentShape.points[1],
              e.target.getStage().getPointerPosition().x - startX,
              e.target.getStage().getPointerPosition().y - startY,
            ],
          });
        }
      }
    }

    if (resizing && selectedElement) {
      const newElements = [...elements];
      const elementIndex = newElements.findIndex(
        (el) => el.id === selectedElement.id
      );
      const element = { ...selectedElement };

      let endX = x;
      let endY = y;

      endX = Math.max(0, Math.min(endX, stageWidth));
      endY = Math.max(0, Math.min(endY, stageHeight));

      if (element.type === "rect") {
        const newWidth = endX - element.x;
        const newHeight = endY - element.y;

        element.width = Math.min(newWidth, stageWidth - element.x);
        element.height = Math.min(newHeight, stageHeight - element.y);
      } else if (element.type === "circle") {
        const newRadius = Math.sqrt(
          Math.pow(endX - element.x, 2) + Math.pow(endY - element.y, 2)
        );

        const maxRadiusX = Math.min(element.x, stageWidth - element.x);
        const maxRadiusY = Math.min(element.y, stageHeight - element.y);
        element.radius = Math.min(newRadius, maxRadiusX, maxRadiusY);
      } else if (element.type === "text") {
        const newWidth = endX - element.x;
        const newHeight = endY - element.y;

        element.width = Math.min(newWidth, stageWidth - element.x);
        element.height = Math.min(newHeight, stageHeight - element.y);
      }

      newElements[elementIndex] = element;
      setElements(newElements);
      setSelectedElement(element);
    }
  };

  const handleMouseUp = () => {
    if (drawing && currentShape) {
      setElements([...elements, currentShape]);
      setDrawing(false);
      setCurrentShape(null);
    }
    setResizing(false);
  };

  const isOnRectBorder = (rect, x, y) => {
    const left = rect.x;
    const right = rect.x + rect.width;
    const top = rect.y;
    const bottom = rect.y + rect.height;

    return (
      (Math.abs(x - left) < 50 ||
        Math.abs(x - right) < 50 ||
        Math.abs(y - top) < 50 ||
        Math.abs(y - bottom) < 50) &&
      x > left - 50 &&
      x < right + 50 &&
      y > top - 50 &&
      y < bottom + 50
    );
  };

  const isOnCircleBorder = (circle, x, y) => {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dy + dy * dy);

    return Math.abs(distance - circle.radius) < 50;
  };

  return (
    <div
      ref={containerRef}
      className="whiteboard"
      style={{ width: "100%", height: "100%" }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {elements.map((element, index) => {
            const isSelected =
              selectedElement && selectedElement.id === element.id;

            switch (element?.type) {
              case "text":
                return (
                  <Text
                    key={index}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    text={element.text}
                    fontSize={element.fontSize}
                    fill={element.fill}
                    draggable
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    width={element.width}
                    height={element.height}
                  />
                );
              case "rect":
                return (
                  <Rect
                    key={index}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill={element.fill}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragMove={handleDragMove}
                    stroke={isSelected ? "blue" : element.stroke}
                    strokeWidth={
                      isSelected ? 2 + element.strokeWidth : element.strokeWidth
                    }
                  />
                );
              case "circle":
                return (
                  <Circle
                    key={index}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    radius={element.radius}
                    fill={element.fill}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragMove={handleDragMove}
                    stroke={isSelected ? "blue" : element.stroke}
                    strokeWidth={
                      isSelected ? 2 + element.strokeWidth : element.strokeWidth
                    }
                  />
                );
              case "line":
              case "stLine":
                return (
                  <Line
                    key={index}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    points={element.points}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragMove={handleDragMove}
                  />
                );
              case "arrow":
                return (
                  <Arrow
                    key={index}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    points={element.points}
                    pointerLength={10}
                    pointerWidth={10}
                    fill={element.stroke}
                    stroke={element.stroke}
                    strokeWidth={element.strokeWidth}
                    draggable
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                  />
                );
              default:
                return null;
            }
          })}
          {currentShape && (
            <>
              {currentShape.type === "rect" ? (
                <Rect
                  x={currentShape.x}
                  y={currentShape.y}
                  width={currentShape.width}
                  height={currentShape.height}
                  fill={currentShape.fill}
                  stroke={currentShape.stroke}
                />
              ) : currentShape.type === "circle" ? (
                <Circle
                  x={currentShape.x}
                  y={currentShape.y}
                  radius={currentShape.radius}
                  fill={currentShape.fill}
                  stroke={currentShape.stroke}
                />
              ) : (
                <Line
                  x={currentShape.x}
                  y={currentShape.y}
                  points={currentShape.points}
                  stroke={currentShape.stroke}
                  strokeWidth={4}
                />
              )}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default WhiteboardComp;
