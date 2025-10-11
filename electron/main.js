const { app, BrowserWindow } = require("electron");
const path = require("path");

if (!app) {
  console.error("Electron app module not available");
  process.exit(1);
}

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

  const devUrl = "http://localhost:3000";
  const prodUrl = `file://${path.join(__dirname, "../out/index.html")}`;

  mainWindow.loadURL(process.env.NODE_ENV === "development" ? devUrl : prodUrl);

  // Open DevTools in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(createWindow);

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
