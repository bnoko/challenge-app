import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div>
                <h1>Hi {user.user_metadata?.full_name || "User"}, you are signed in!</h1>
                <button onClick={handleSignOut}>Sign out</button>
                <Footer />
              </div>
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        <Route
          path="/sign-in"
          element={
            <div>
              <h1>Welcome</h1>
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
                  if (error) console.error("Error during sign-in:", error.message);
                }}
              >
                Sign in with Google
              </button>
              <Footer />
            </div>
          }
        />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

const Footer = () => (
  <footer style={{ textAlign: "center", marginTop: "20px" }}>
    <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
  </footer>
);

export default App;
