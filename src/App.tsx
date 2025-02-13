import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./supabase"; // Adjust the import as needed
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
  
      if (error) {
        console.error("Error fetching session:", error.message);
        navigate("/sign-in"); // Redirect to sign-in on error
        return;
      }
  
      if (data.session) {
        // If a session exists, get the user ID
        const userId = data.session.user?.id; // Access `user` safely via `session.user`
        if (userId) {
          navigate("/home"); // Redirect to Home
        } else {
          navigate("/sign-in"); // Fallback to sign-in if no user ID
        }
      } else {
        navigate("/sign-in"); // Redirect to sign-in if no session
      }
    };
  
    checkUserSession();
  }, [navigate]);
  

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to Challenge App</h2>
      <button onClick={() => navigate("/home")} style={{ margin: "10px" }}>
        Pretend user is logged in
      </button>
      <button onClick={() => navigate("/sign-in")} style={{ margin: "10px" }}>
        Pretend user is not logged in
      </button>
    </div>
  );  
};

const Root: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      {/* Redirect Invite Link for Hana's challenges */}
      <Route path="/invite/j234wx" element={<RedirectToGoogleForm />} />
    </Routes>
  </Router>
);
      
{/* Redirect support for Invite Link for Hana's challenges */}
const RedirectToGoogleForm = () => {
  window.location.href = "https://forms.gle/wGKQm1wYcww7N8C46";
  return null;
};  

export default Root;
