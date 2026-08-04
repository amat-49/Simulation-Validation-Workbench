const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runSimulation: (scenario) =>
    ipcRenderer.invoke("simulation:run", scenario),

  getExecutionHistory: () =>
    ipcRenderer.invoke("history:get"),

  exportReport: (format) =>
    ipcRenderer.invoke("report:export", format),
});