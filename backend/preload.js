const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld(
    "simulationAPI",
    {

        runSimulation: (configPath, scenarioId) =>
            ipcRenderer.invoke(
                "run-simulation",
                configPath,
                scenarioId
            )

    }
);