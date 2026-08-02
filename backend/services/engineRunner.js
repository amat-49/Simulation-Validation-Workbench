const { execFile } = require("child_process");
const path = require("path");

/**
 * Runs the compiled C++ simulation engine.
 * @param {string} configPath - Path to the scenario JSON file.
 * @returns {Promise<Object>} Parsed JSON returned by the engine.
 */
function runEngine(configPath) {

    return new Promise((resolve, reject) => {

        // Location of the compiled engine executable
        const enginePath = path.resolve(
            __dirname,
            "../../engine/build/sim_engine"
        );

        // Convert config path to an absolute path
        const absoluteConfig = path.resolve(configPath);

        // Execute the engine
        execFile(
            enginePath,
            [absoluteConfig],
            (error, stdout, stderr) => {

                if (error) {
                    reject(new Error(stderr || error.message));
                    return;
                }

                try {
                    const result = JSON.parse(stdout);
                    resolve(result);
                }
                catch (err) {
                    reject(
                        new Error("Engine returned invalid JSON.")
                    );
                }

            }
        );

    });

}


module.exports = {
    runEngine
};