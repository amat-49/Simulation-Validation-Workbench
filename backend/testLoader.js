const { loadConfig } = require("./config/configLoader");

try {

    const config = loadConfig(
        "./config/scenarios/scenario1.json"
    );

    console.log(config);

} catch (error) {

    console.error(error.message);

}