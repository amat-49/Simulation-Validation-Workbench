const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Simulation runner
  runSimulation: (configPath, scenarioId) =>
    ipcRenderer.invoke("simulation:run", configPath, scenarioId),

  // File dialogs and reading
  chooseScenarioFile: () =>
    ipcRenderer.invoke("dialog:openScenario"),

  readJsonFile: (filePath) => 
    ipcRenderer.invoke("read-json-file", filePath),

  // History and Reports
  getExecutionHistory: () =>
    ipcRenderer.invoke("history:get"),

  exportReport: (format) =>
    ipcRenderer.invoke("report:export", format),

  getLatestResults: () => 
    ipcRenderer.invoke('simulation:get-latest-results'),

  getAllRuns: () => 
    ipcRenderer.invoke('simulation:get-all-runs'),
});