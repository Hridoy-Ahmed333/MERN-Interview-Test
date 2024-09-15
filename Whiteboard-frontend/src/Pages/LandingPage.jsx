import LeftBar from "../Components/LeftBar";
import RightCol from "../Components/RightCol";
import "./LandingPage.css";
function LandingPage() {
  return (
    <div>
      <div className="landing-page-body">
        <LeftBar />
        <div className="right-col">
          <RightCol />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
