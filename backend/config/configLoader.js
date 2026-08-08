
// Import fs which lets Node.js read, create, delete files
const fs = require("fs");

// Import path to safely build file paths on windows, macos and linux
const path = require("path");

/**
 * Loads a JSON configuration file.
 * @param {string} filePath - Path to the configuration file.
 * @returns {Object} Parsed configuration object.
 */

// This is the function we will use to load and config files that the user uploaded ex: laodConfig("./config/scenarios/sceranrio1.json");
function loadConfig(filePath) {
    try {

        // converts the file an absolute path 
        const absolutePath = path.resolve(filePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Configuration file not found: ${absolutePath}`);
        }
        // reads the file and creates a new node with scenarioName, as plain text 
        const fileContents = fs.readFileSync(absolutePath, "utf8");

        // Converts the text into an object 
        const config = JSON.parse(fileContents);

        // This will print the configuration and makes debugging easier
        console.log(`Configuration "${config.scenario_name}" loaded successfully.`);

        return config;

    } catch (error) {

        throw new Error(
            `Failed to load configuration file: ${error.message}`
        );
    }
}

module.exports = {
    loadConfig
};