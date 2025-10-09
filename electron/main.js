const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devUrl = "http://localhost:3000"; // Updated to port 3000
  const prodUrl = `file://${path.join(__dirname, "../out/index.html")}`;

  mainWindow.loadURL(process.env.NODE_ENV === "development" ? devUrl : prodUrl);

  mainWindow.on("closed", () => (mainWindow = null));
}

// Check if we're in an Electron environment
if (typeof app !== 'undefined' && app) {
  app.on("ready", createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
} else {
  console.log("Not running in Electron environment");
}
