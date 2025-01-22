import { useState } from "react";
import { supabase } from "./supabase";

function App() {
  // State for form inputs
  const [name, setName] = useState("");
  const [redChecked, setRedChecked] = useState(false);
  const [blueChecked, setBlueChecked] = useState(false);
  const [message, setMessage] = useState("");

  // State for leaderboard
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  // Function to update the leaderboard
  const updateLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("name, count(*) as submission_count")
        .group("name")
        .order("submission_count", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching leaderboard:", error);
        return;
      }

      setLeaderboard(data || []);
    } catch (err) {
      console.error("Unexpected error fetching leaderboard:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Enter your name and choose a checkbox:</h1>
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

      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.submission_count} submissions
          </li>
        ))}
      </ul>
      <button onClick={updateLeaderboard}>Update Leaderboard</button>
    </div>
  );
}

export default App;
