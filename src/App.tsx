import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Import the new Privacy Policy component
import TermsOfService from "./pages/TermsOfService"; // Import the new Terms of Service component
import SignIn from "./pages/SignIn"; // Adjust the path to your SignIn.tsx file
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js"; // Import the User type


function App() {
  // State and functions remain unchanged
  const [name, setName] = useState("");
  const [redChecked, setRedChecked] = useState(false);
  const [blueChecked, setBlueChecked] = useState(false);
  const [message, setMessage] = useState("");
  
  interface LeaderboardEntry {
    name: string;
    submission_count: number;
  }

  // Initialize the user state and fetch the currently logged-in user from Supabase when the app loads.
  //TEMP: Hardcode the user state to simulate being logged in (replacing the line //const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>({
    id: "sample-user-id", // Fake user ID
    email: "user@example.com",
    user_metadata: { full_name: "Test User" }, // Fake user metadata
    app_metadata: {}, // Can be an empty object or any default value
    aud: "", // An empty string or default value
    created_at: "", // A default or empty string
  });
  




useEffect(() => {
  const fetchUser = async () => {
    // Log session data to inspect
    const { data, error } = await supabase.auth.getSession();
    console.log("Session data:", data);  // Log session to check if it's being fetched
    if (error) {
      console.error("Error fetching session:", error.message);
      return;
    }
    setUser(data.session?.user || null);  // Set user or null based on session data
  };

  fetchUser();
}, []);


  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form handling logic
    if (redChecked && blueChecked) {
      setMessage(`${name}, you crafty devil. I didn't say you could check both checkboxes!`);
      return;
    } else if (!redChecked && !blueChecked) {
      setMessage("Please select at least one checkbox.");
      return;
    }

    try {
      const { error } = await supabase.from("submissions").insert([
        {
          name: name,
          red_checked: redChecked,
          blue_checked: blueChecked,
        },
      ]);

      if (error) {
        console.error("Error saving submission:", error);
        setMessage("Error saving your selection.");
      } else {
        setMessage(
          redChecked
            ? `${name}, you selected the red checkbox!`
            : `${name}, you selected the blue checkbox!`
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred.");
    }
  };

  const updateLeaderboard = async () => {
    console.log("Update Leaderboard button clicked");
    try {
      const { data, error } = (await supabase.rpc("get_leaderboard")) as {
        data: LeaderboardEntry[];
        error: any;
      };

      if (error) {
        console.error("Error fetching leaderboard:", error);
        return;
      }

      console.log("Fetched leaderboard data:", data);
      setLeaderboard((data as LeaderboardEntry[]) || []);
    } catch (err) {
      console.error("Unexpected error fetching leaderboard:", err);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Sign In Page */}
        <Route path="/sign-in" element={<SignIn />} />
        {/* Main App (Default Route) */}
        <Route
          path="/"
          element={
            // UNDONE: Temp removal of next line to Bypass the user check (as well as comments at bottom)
            user ? 
            (
              <div style={{ textAlign: "left", marginTop: "20px", marginLeft: "20px" }}>
                  <div>
                    <h1>{user ? `Hi, ${user.user_metadata.full_name}!` : "Welcome!"}</h1>
                  </div>
                <h2>Enter your name and choose a checkbox:</h2>
                <form onSubmit={handleSubmit}>
                  <label>
                    Your name:
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={redChecked}
                        onChange={(e) => setRedChecked(e.target.checked)}
                      />
                      Red checkbox
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={blueChecked}
                        onChange={(e) => setBlueChecked(e.target.checked)}
                      />
                      Blue checkbox
                    </label>
                  </div>
                  <button type="submit">Submit</button>
                </form>
                <p>{message}</p>

                <h3>Leaderboard</h3>
                <ul>
                  {leaderboard.map((entry, index) => (
                    <li key={index}>
                      {entry.name}: {entry.submission_count} submissions
                    </li>
                  ))}
                </ul>
                <button onClick={updateLeaderboard}>Update Leaderboard</button>
              </div>
            // Temp removal of next two lines to Bypass the user check (as well as comments at top
            ) : (
              //<Navigate to="/sign-in" replace /> // Redirect to sign-in if user is not authenticated
              <div>Please log in to see the content.</div> // Placeholder content
            )
          }
        />
        {/* Privacy Policy Page */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Terms of Service Page */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
      {/* Footer visible on all pages */}
      <footer style={{ textAlign: "left", marginTop: "20px", marginLeft: "20px" }}>
        <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
      </footer>
    </Router>
  );
}

export default App;
