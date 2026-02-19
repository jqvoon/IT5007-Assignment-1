# IT5007-Assignment-1

## Setup

### Tech Stack

* **Frontend:** React.js (Vite)
* **Backend:** Node.js

---

## Node.js Requirement

This project requires **Node.js v24.13.1**.
The startup scripts (`startup.sh` and `startup.bat`) will automatically check your Node version and exit if it does not match.

If you use **nvm** (Node Version Manager), you can switch to the correct version with:

```bash
nvm use
```

---

## How to Run

You can run the project either manually via npm commands or using the provided **startup script** for convenience.

---

### **Option 1: Using the startup script (recommended)**

#### macOS / Linux / windows

##### Since we are inside a Docker container, both macOS and Windows users uses the same bash commands and files in the shell terminal.

1. Make the script executable:

```bash
chmod +x /home/it5007/IT5007-Assignment-1/my-app/startup.sh
```

2. Run the script:

```bash
bash /home/it5007/IT5007-Assignment-1/my-app/startup.sh
```

> This script will automatically:
>
> * Verify your Node.js version (`v24.13.1`)
> * Install dependencies (`npm ci`)
> * Run tests (`npm test`)
> * Build the frontend (`npm run build`)
> * Start the production server (`npm run start`)

---

### **Option 2: Manual steps using npm**
#### 1. Install dependencies

```bash
npm ci
```

#### 2. Run the tests
```bash
npm test
```

#### 3. Run the build

```bash
npm run build
```

#### 4. Start the app

```bash
npm start
```

The frontend will be available at `http://localhost:3000` where the backend is served together.

### **Running in dev environment**
#### 1. Install dependencies

```bash
npm install
```

#### 2. Run the frontend (Vite dev server)

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Project Structure

```
my-app/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, SVGs, other static assets
│   ├── components/        # React components
│   │   ├── AddBooking.jsx
│   │   ├── AvailableTickets.jsx
│   │   ├── DeleteBooking.jsx
│   │   ├── DisplayAttendee.jsx
│   │   ├── NavBar.jsx
│   │   ├── SeatMap.jsx
│   ├── context/           # React context API
│   │   └── appContext.jsx
│   ├── tests/             # Test files
│   │   ├── setup.js       # Test setup file
│   │   ├── integrated/
│   │   └── unit/
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
├── .nvmrc                 # Node version file
├── .eslintrc.js           # ESLint configuration
├── index.html             # HTML entry
├── package-lock.json
├── package.json
├── README.md
├── server.js              # Node.js backend
├── startup.sh             # Cross-platform startup script (macOS/Linux/Docker)
├── vite.config.js         # Vite config
```

---

### Notes

* Make sure you have the required Node.js version (`v24.13.1`) before running the scripts.
* The `startup.sh` script handle all steps automatically, making it easy to set up and run the project on the Docker Container in both Windows and macOS/Linux.
