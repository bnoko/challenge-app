import { useEffect, useState } from "react";
import { supabase } from "../supabase"; 

const SignIn = () => {
  const [loading, setLoading] = useState(true); // Track loading state

  const handleSignIn = async () => {
    console.log("Sign-in button clicked");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google", // Specify Google as the OAuth provider
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
        window.location.href = "/"; // Redirect to home after setting session
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
        window.location.href = "/";  // Redirect to the home page or dashboard
      }

      setLoading(false);
    };

    checkSession();
  }, []);

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
