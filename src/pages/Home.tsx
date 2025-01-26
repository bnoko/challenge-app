import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, [name]!</h1>
      <button onClick={() => navigate("/sign-in")} style={{ margin: "10px" }}>
        Pretend to log out
      </button>
      <footer style={{ marginTop: "50px" }}>
        <a href="/privacy-policy">Privacy Policy</a> |{" "}
        <a href="/terms-of-service">Terms of Service</a>
      </footer>
    </div>
  );
};

export default Home;
