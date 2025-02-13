import { useEffect } from "react";
import { handleSignInWithGoogle } from '../auth/googleAuth';

const SignIn: React.FC = () => {
  useEffect(() => {
    // Ensure the Google client library initializes and renders the button
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Initialize the One Tap functionality
      window.google.accounts.id.initialize({
        client_id: "701922595564-o1d6c6ddoc52nbh09ocgtidg4vvd5vau.apps.googleusercontent.com",
        callback: handleSignInWithGoogle, // Ensure this is globally exposed
      });

      // Render the button in the .g_id_signin div
      window.google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"), // Target the button container
        {
          type: "standard",
          shape: "rectangular",
          theme: "outline",
          size: "large",
          text: "signin_with",
          logo_alignment: "left",
        }
      );
    }
  }, []); // Run this only once when the component mounts

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Challenge App</h2>
      <div
        id="g_id_onload"
        data-client_id="701922595564-o1d6c6ddoc52nbh09ocgtidg4vvd5vau.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
      <footer style={{ marginTop: "50px" }}>
        <a href="/privacy-policy">Privacy Policy</a> |{" "}
        <a href="/terms-of-service">Terms of Service</a>
      </footer>
    </div>
  );
};

export default SignIn;
