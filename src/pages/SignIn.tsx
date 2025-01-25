import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom"; // Import navigate

const SignIn = () => {
  const navigate = useNavigate(); // Create a navigate instance for programmatic routing
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    console.log("Sign-in button clicked");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Sign-in failed:", error.message);
    } else {
      console.log("Sign-in initiated successfully. Complete the OAuth flow.");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        console.log("Session set successfully");
        navigate("/"); // Use navigate for redirection
        return;
      }

      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        setLoading(false);
        return;
      }

      if (session) {
        console.log("User is already signed in:", session);
        navigate("/"); // Use navigate for redirection
      }

      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Challenge App</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
