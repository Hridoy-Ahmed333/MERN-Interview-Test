import { getWhiteboard } from "../API/whiteboardApi";
import { useQuery } from "@tanstack/react-query";
import Card from "./Card";

function LeftBar() {
  const { data: whiteboards } = useQuery({
    queryKey: ["whiteboards"],
    queryFn: getWhiteboard,
  });

  if (!whiteboards) return <p>Loading...</p>;

  return (
    <div className="card-container-body">
      {whiteboards.map((whiteboard, index) => (
        <div key={index} className="card-container-row">
          <Card
            id={whiteboard._id}
            // title={whiteboard.title}
            title={whiteboard.name}
            date={whiteboard.date}
            content={whiteboard.content}
          />
        </div>
      ))}
    </div>
  );
}

export default LeftBar;
