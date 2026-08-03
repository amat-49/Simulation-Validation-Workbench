const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDevelopment = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDevelopment) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

ipcMain.handle("simulation:run", async (_event, scenario) => {
  return {
    success: true,
    scenario,
    message: "Simulation request received by Electron.",
  };
});

ipcMain.handle("history:get", async () => {
  return [];
});

ipcMain.handle("report:export", async (_event, format) => {
  return {
    success: true,
    format,
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});