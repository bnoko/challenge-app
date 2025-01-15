function processSelection() {
    let name = document.getElementById("userName").value.trim();
    let redChecked = document.getElementById("redCheckbox").checked;
    let blueChecked = document.getElementById("blueCheckbox").checked;
    let messageElement = document.getElementById("message");

    // Ensure name is entered
    if (!name) {
        messageElement.innerText = "Please enter your name before submitting.";
        return;
    }

    // Determine message
    let message;
    if (redChecked && blueChecked) {
        message = `${name}, you crafty devil. I didn't say you could check both checkboxes!`;
    } else if (redChecked) {
        message = `${name}, you chose the red checkbox.`;
    } else if (blueChecked) {
        message = `${name}, you chose the blue checkbox.`;
    } else {
        message = `${name}, you didn't select anything.`;
    }

    // Display the message only after clicking submit
    messageElement.innerText = message;

    // Send selection to the server
    fetch('/submit-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            redChecked: redChecked,
            blueChecked: blueChecked,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
}


// Attach event listeners to both checkboxes
document.getElementById("redCheckbox").addEventListener("change", updateMessage);
document.getElementById("blueCheckbox").addEventListener("change", updateMessage);


function showLeaderboard() {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(data => {
            let leaderboardElement = document.getElementById("leaderboard");
            leaderboardElement.innerHTML = data.map((entry, index) => 
                `<li>${["🥇", "🥈", "🥉"][index]} ${entry.name} - ${entry.submission_count} submissions</li>`
            ).join("");
        })
        .catch(error => console.error("Error loading leaderboard:", error));
}
