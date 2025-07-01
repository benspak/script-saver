# Script Saver

A modern web app for saving, editing, and organizing scripts with tags, descriptions, and offline support. Built with React, Chakra UI, Express, and MongoDB.

---

## Features
- Save, edit, and delete scripts
- Organize scripts with tags and descriptions
- Two-panel UI: script list and script details
- Search/filter scripts by title, tags, description, or content (instant, frontend-only)
- Copy script content to clipboard
- Responsive, dark, Spotify-inspired UI
- Offline support (PWA)

---

## Getting Started

### 1. **Clone the repository**
```bash
git clone <repo-url>
cd Script-saver
```

### 2. **Install dependencies**
#### Backend (Express/MongoDB):
```bash
cd server
npm install
```
#### Frontend (React/Chakra UI):
```bash
cd ../client
npm install
```

### 3. **Set up MongoDB**
- You need a MongoDB instance (local or Atlas).
- Create a `.env` file in the `server/` directory:
  ```
  MONGO_URI=mongodb://localhost:27017/script-saver
  PORT=5000
  ```
  (Replace with your Atlas URI if needed.)

### 4. **Run the backend**
```bash
cd ../server
node index.js
```

### 5. **Run the frontend**
```bash
cd ../client
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Importing Scripts from CSV
- Place your CSV file (e.g., `customer-scripts.csv`) in the `server/` directory.
- Edit `import_csv.js` if needed to match your CSV filename.
- Run:
  ```bash
  node server/import_csv.js
  ```
- The first column is mapped to script title, the second to script content.

---

## Usage
- **Create**: Click "New Script" to add a new script.
- **Edit**: Select a script, edit fields, and click "Save".
- **Delete**: Click the trash icon to delete a script.
- **Copy**: Click the copy icon to copy script content to clipboard.
- **Search**: Use the search bar to instantly filter scripts.

---

## Tech Stack
- **Frontend**: React, Vite, Chakra UI
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Offline**: PWA (service worker)

---

## Troubleshooting
- If you see connection errors, ensure MongoDB is running and `.env` is correct.
- For UI issues, try restarting the frontend (`npm run dev`).
- For backend issues, check the terminal for error logs.

---

## Contributing
- Fork the repo and create a feature branch.
- Open a pull request with your changes.

---

## License
MIT
