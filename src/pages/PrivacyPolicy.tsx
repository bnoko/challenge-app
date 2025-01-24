import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate(); // UseNavigate must be inside the function body

  return (
    <div style={{ textAlign: "left", marginTop: "20px", marginLeft: "20px" }}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Privacy Policy</h1>
      <p>
        Welcome to Challenge App! Your privacy is important to us. This page describes how we
        collect, use, and protect your personal data.
      </p>
      <h2>Information We Collect</h2>
      <p>We may collect the following data when you use our app:</p>
      <ul>
        <li>Your name and email address via Google Sign-In.</li>
        <li>Your activity within the app, such as challenges and submissions.</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <p>
        We use your data to personalize your experience, display leaderboards, and improve the app.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please email us at byron.ux@gmail.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
