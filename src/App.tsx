import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js"; // Import the User type


function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      setUser(data.session?.user || null);
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
        <Route
          path="/sign-in"
          element={
            <div>
              <h1>Sign In</h1>
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
                  if (error) console.error("Error during sign-in:", error.message);
                }}
              >
                Sign in with Google
              </button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
