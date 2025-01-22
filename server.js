import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the React build files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
