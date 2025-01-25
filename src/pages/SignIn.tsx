import { supabase } from "../supabase";

const SignIn = () => {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Sign-in error:", error.message);
    } else {
      console.log("Sign-in initiated.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
      <Footer />
    </div>
  );
};

const Footer = () => (
  <footer style={{ textAlign: "center", marginTop: "20px" }}>
    <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
  </footer>
);

export default SignIn;
