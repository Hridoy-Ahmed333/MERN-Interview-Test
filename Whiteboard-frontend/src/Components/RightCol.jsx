import { FaRegPlusSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function RightCol() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/whiteboard");
  };
  return (
    <div className="add-class" onClick={handleClick}>
      <div className="add-class-sign">
        <FaRegPlusSquare size={150} />
      </div>
      <div className="add-class-text">
        Write on The
        <br /> Whiteboard
      </div>
    </div>
  );
}

export default RightCol;
