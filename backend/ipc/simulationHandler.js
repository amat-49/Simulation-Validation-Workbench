const { ipcMain } = require('electron');
const path = require('path');
const dbManager = require('../../database');
// Import your dataService that handles running the engine and saving to SQLite
const { runAndSaveSimulation } = require('../../backend/services/databaseService'); // Adjust relative path to point to your dataService file

function registerSimulationHandler() {
  ipcMain.handle('simulation:run', async (event, configPath, scenarioId = 1) => {
    try {
      // Resolve to an absolute path for safety
      const absoluteConfigPath = path.resolve(configPath);
      
      // Call your dataService function which runs the engine and saves everything to the database
      const savedRunDetails = await runAndSaveSimulation(absoluteConfigPath, scenarioId);
      
      return { 
        success: true, 
        results: savedRunDetails 
      };
    } catch (error) {
      console.error("Simulation Execution & Database Save Error:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  });

  ipcMain.handle('simulation:get-latest-results', async () => {
  try {
    // Grab the latest run and its details directly from your DatabaseManager
    const latestRun = dbManager.getLatestRun(); 
    if (!latestRun) return { success: false, error: "No runs found" };

    const runId = latestRun.run_id;
    return {
      success: true,
      data: {
        ...latestRun,
        metrics: dbManager.getOutputsByRunId(runId),
        validation_results: dbManager.getValidationResultsByRunId(runId)
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('simulation:get-all-runs', async () => {
  try {
    const runs = dbManager.getExecutionHistory(); // Using your dbManager function!
    return { success: true, data: runs };
  } catch (error) {
    console.error("IPC Error fetching runs:", error);
    return { success: false, error: error.message };
  }
});

}

module.exports = { registerSimulationHandler };