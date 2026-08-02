const { app, BrowserWindow } = require("electron");
const path = require("path");

const { registerSimulationHandler } = require("./ipc/simulationHandler");
// Add these later when you create them:
// const { registerHistoryHandler } = require("./ipc/historyHandler");
// const { registerReportHandler } = require("./ipc/reportHandler");


function createWindow() {

    const mainWindow = new BrowserWindow({

        width: 1200,
        height: 800,

        webPreferences: {

            // Allows React to communicate safely with Electron
            preload: path.join(__dirname, "preload.js"),

            nodeIntegration: false,
            contextIsolation: true

        }

    });


    // Development:
    // mainWindow.loadURL("http://localhost:3000");


    // Production:
    mainWindow.loadFile(
        path.join(__dirname, "../frontend/dist/index.html")
    );

}


app.whenReady().then(() => {


    // Register backend communication channels
    registerSimulationHandler();


    // Later:
    // registerHistoryHandler();
    // registerReportHandler();


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