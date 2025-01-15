const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

// PostgreSQL connection setup

const pool = new Pool({
    user: process.env.PGUSER,
    host: 'roundhouse.proxy.rlwy.net', // ✅ Use this as the hostname
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 20449, // ✅ Use Railway's assigned port
    ssl: { rejectUnauthorized: false } // ✅ Required for Railway
});


pool.connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch(err => console.error("❌ Database connection error:", err));

    (async () => {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS submissions (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    red_checked BOOLEAN NOT NULL,
                    blue_checked BOOLEAN NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("✅ Table ensured");
        } catch (error) {
            console.error("❌ Error ensuring table:", error);
        }
    })();
    

// Handle form submissions
app.post('/submit-selection', async (req, res) => {
    const { name, redChecked, blueChecked } = req.body;

    try {
        // Insert submission into database
        await pool.query(
            'INSERT INTO submissions (name, red_checked, blue_checked) VALUES ($1, $2, $3)',
            [name, redChecked, blueChecked]
        );
        res.json({ message: "Selection saved successfully!" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error saving data." });
    }
});

// Retrieve leaderboard (Top 3 users with most submissions)
app.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT name, COUNT(*) AS submission_count
             FROM submissions
             GROUP BY name
             ORDER BY submission_count DESC
             LIMIT 3`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Error loading leaderboard." });
    }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000; // Use Railway's port or default to 3000 locally
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
