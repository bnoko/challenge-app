import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure the path to your Supabase client is correct

const SignIn = () => {
  const [loading, setLoading] = useState(true); // Track loading state

  // Function to handle Google Sign-In using Supabase OAuth
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

  // Check if the user is already authenticated and handle token-based authentication after redirect
  useEffect(() => {
    const checkSession = async () => {
      // Fetch session on page load to handle any existing login session
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error.message);
        setLoading(false);
        return;
      }

      if (session) {
        console.log("User is already signed in:", session);
        window.location.href = "/"; // Redirect to the home page or dashboard
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  // If the app is loading or checking session, show a loading message
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
