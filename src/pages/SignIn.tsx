import { supabase } from "../supabase"; // Adjust the import path to your Supabase client

const SignIn = () => {
  // Function to handle Google Sign-In
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google", // Specify Google as the OAuth provider
    });
    if (error) {
      console.error("Sign-in failed:", error.message);
    }
  };

  // Render a button to trigger the Sign-In flow
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Challenge App</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
