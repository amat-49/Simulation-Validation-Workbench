const { ipcMain } = require("electron");
const { loadConfig } = require("../config/configLoader");
const { validateConfig } = require("../config/configValidator");
const { runAndSaveSimulation } = require("../services/databaseService");

/**
 * Handles a simulation request.
 * @param {string} configPath
 * @param {number} scenarioId
 * @returns {Object}
 */

async function runSimulation(configPath, scenarioId) {

    try {

        // Loading the configuartion file
        const config = loadConfig(configPath);

        // Validate the configuratioon
        const validation = validateConfig(config);

        if (!validation.valid) {

            return {
                success: false,
                errors: validation.errors
            };

        }

        // Run the real C++ simulation engine
        const simulationResults = await runAndSaveSimulation(
            configPath,
            scenarioId
        );

        return {
            success: true,
            results: simulationResults
        };

    }

    catch (error) {

        return {
            success: false,
            errors: [error.message]

        };

    }

}

/**
 * Registers IPC communication with Electron frontend
 */

function registerSimulationHandler() {

    ipcMain.handle(
        "run-simulation",
        async (event, configPath, scenarioId) => {

            return await runSimulation(
                configPath,
                scenarioId
            );

        }
    );

}

module.exports = {
    runSimulation,
    registerSimulationHandler
};