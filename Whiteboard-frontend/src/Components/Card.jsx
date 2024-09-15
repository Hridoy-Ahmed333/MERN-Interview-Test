import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteWhiteboard } from "../API/whiteboardApi";

const Card = ({ id, title, date }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: (storedId) => deleteWhiteboard(storedId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["whiteboards"],
      });
      toast.success("Whiteboard deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete whiteboard: ${error.message}`);
    },
  });

  const handleClickDelete = () => {
    deleteMutation(id);
  };

  const handleClick = () => {
    navigate("/whiteboard", { state: { id } });
  };
  return (
    <div className="card-container">
      <div className="card">
        <div className="card-header" onClick={handleClick}>
          <h3 className="card-title">{title}</h3>
          <span className="card-date">
            {moment(date).format("MMMM D, YYYY")}
          </span>
        </div>
        <div className="card-content" onClick={handleClick}></div>
        <div className="card-footer">
          <button onClick={handleClickDelete} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
