import Spinner from "react-bootstrap/Spinner";

const Loading = () => {
  return (
    <div className="spinner-container">
      <Spinner animation="border" variant="info" />
    </div>
  );
};

export default Loading;
