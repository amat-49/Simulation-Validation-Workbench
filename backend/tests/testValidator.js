const { loadConfig } = require("../config/configLoader");
const { validateConfig } = require("../config/configValidator");

const config = loadConfig("../config/scenarios/scenario1.json");

const result = validateConfig(config);

console.log(result);
