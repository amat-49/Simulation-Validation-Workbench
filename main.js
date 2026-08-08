const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { execFile } = require('child_process');

const { registerSimulationHandler } = require("./backend/ipc/simulationHandler");

const isDevelopment = !app.isPackaged;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            // Points to the preload.js sitting in the backend/root folder
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (isDevelopment) {
        // Loads your Vite React dev server
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.loadFile(
            path.join(__dirname, "../frontend/dist/index.html")
        );
    }
}

// --- IPC HANDLERS FOR DIALOGS & FILES ---

ipcMain.handle("dialog:openScenario", async () => {
    const result = await dialog.showOpenDialog({
        title: "Select Scenario",
        filters: [
            {
                name: "JSON Files",
                extensions: ["json"]
            }
        ],
        properties: ["openFile"]
    });
    if (result.canceled) {
        return null;
    }
    return result.filePaths[0];
});

ipcMain.handle("read-json-file", async (event, filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read file:", error);
        return null;
    }
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

// --- APP LIFECYCLE ---

app.whenReady().then(() => {
    // Register your modular backend simulation handler
    registerSimulationHandler();

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