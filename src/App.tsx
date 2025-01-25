import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js"; // Import the User type

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
          return;
        }
        setUser(data.session?.user || null);
        console.log("Session fetched on load:", data);
      } catch (err) {
        console.error("Unexpected error fetching session:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div>
                <h1>Welcome, {user?.email || "User"}!</h1>
              </div>
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

const SignIn = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const hash = window.location.hash;
      console.log("URL Hash:", hash);

      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          console.log("Session set successfully with tokens.");
          window.location.href = "/";
        } catch (error) {
          console.error("Error setting session with tokens:", error);
        }
        return;
      }

      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session during redirect:", error.message);
        setLoading(false);
        return;
      }

      if (session) {
        console.log("User already signed in:", session);
        window.location.href = "/";
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
          if (error) {
            console.error("Error during sign-in:", error.message);
          } else {
            console.log("Sign-in initiated.");
          }
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default App;
