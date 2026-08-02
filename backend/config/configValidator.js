/*
- Validate a simulation configuration
* @param {object} config
* @returns {{valid: boolean, erroors: string[]}}
*/

function validateConfig(config) {
    const errors = [];

    // check the scnenarioName
    if (!config.scenario_name) {
        error.push("Missing scenarioName.");
    }

    // check parameters object
    if (!config.parameters || typeof config.parameters !== "object") {
        errors.push("Missing parameters section.");
    }

    // check validation object
    if (!config.expected_metrics) {
        errors.push("Missing validation section.");
    } else {
        for (const [metricName, metric] of Object.entries(config.expected_metrics)) {
            checkMetric(metricName, metric, errors);
        }
    }

    return {
        valid: errors.length == 0,
        errors
    };
}

// Validates one validation rule 
function checkMetric(name, metric, errors) {

    if (!metric) {

        errors.push(`Missing validation for ${name}.`);
        return;

    }

    if (typeof metric.expected_min !== "number") {

        errors.push(`${name}.min must be a number.`);

    }

    if (typeof metric.expected_max !== "number") {

        errors.push(`${name}.max must be a number.`);

    }

    if (
        typeof metric.expected_min === "number" &&
        typeof metric.expected_max === "number" &&
        metric.expected_min > metric.expected_max
    ) {

        errors.push(`${name}: min cannot be greater than max.`);

    }

}

module.exports = {
    validateConfig
};