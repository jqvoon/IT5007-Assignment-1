# IT5007-Assignment-1

## Setup

### Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Node.js

---

## How to Run

### 1. Install dependencies
```bash
npm install
```

### 2. Build the frontend
```bash
npm run build
```

### 3. Run the frontend (Vite dev server)
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` where the backend is served together


## Project Structure

```
my-app/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and SVGs
│   ├── App.jsx      # Main App component
│   ├── App.css      # App styles
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── server.js        # Node.js backend
├── index.html       # HTML entry point
├── vite.config.js   # Vite configuration
└── package.json     # Dependencies and scripts
```