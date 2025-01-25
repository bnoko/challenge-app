import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure the path to your Supabase client is correct
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router

const SignIn = () => {
  const navigate = useNavigate(); // Create a navigate instance for programmatic routing
  const [loading, setLoading] = useState(true); // Track loading state

  // Function to handle Google Sign-In using Supabase OAuth
  const handleSignIn = async () => {
    console.log("Sign-in button clicked");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Sign-in failed:", error.message);
    } else {
      console.log("Sign-in successful");
      // Log session after sign-in attempt
      const { data } = await supabase.auth.getSession();
      console.log("Post-sign-in session:", data);
    }
  };

  // Check if the user is already authenticated and handle token-based authentication after redirect
  useEffect(() => {
    const checkSession = async () => {
      // Log the current URL hash to debug token retrieval
      console.log("Current URL hash:", window.location.hash);

      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      console.log("Access Token:", accessToken);  // Log access token
      console.log("Refresh Token:", refreshToken); // Log refresh token

      if (accessToken && refreshToken) {
        // If tokens exist, set the session
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        console.log("Session set successfully"); // Log session set success
        window.location.href = "/"; // Redirect to home after setting session
        return;
      }

      // Fetch the session
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
        setLoading(false);
        return;
      }

      // If the user is already signed in, redirect them to the home page
      if (session) {
        console.log("User is already signed in:", session);
        navigate("/");  // Redirect to the home page or dashboard
      }

      // Stop the loading state once all checks are complete
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  // If the app is loading or checking session, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the Sign-In button
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Challenge App</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
