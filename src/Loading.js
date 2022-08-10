import "./App.css";
const Loading = () => {
  return (
    <div>
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="status">
        Loading<span class="status__dot">.</span>
        <span class="status__dot">.</span>
        <span class="status__dot">.</span>
      </div>
    </div>
  );
};

export default Loading;
