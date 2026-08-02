const path = require('path');
const { runAndSaveSimulation } = require('../services/databaseService');
const dbManager = require('../../database/DatabaseManager');

async function testDatabaseIntegration() {
    try {
        console.log('Inserting a test scenario into the database...');
        
        // 1. Save a test scenario record to satisfy foreign key constraints
        const scenarioInfo = dbManager.saveScenario({
            scenario_name: 'basic_test',
            description: 'Automated test scenario',
            config_file_path: 'config/scenarios/scenario1.json'
        });
        const scenarioId = scenarioInfo.scenario_id;

        console.log(`Scenario created with ID: ${scenarioId}. Running simulation and saving results...`);

        // 2. Correct path to the scenario JSON file from inside backend/tests/
        const configPath = path.join(__dirname, '../config/scenarios/scenario1.json');

        // 3. Execute simulation and persist to SQLite
        const savedRun = await runAndSaveSimulation(configPath, scenarioId);

        console.log('Successfully ran simulation and saved to SQLite!');
        console.log('Retrieved saved run from database:');
        console.log(JSON.stringify(savedRun, null, 2));

    } catch (error) {
        console.error('Database integration test failed:', error.message);
    }
}

testDatabaseIntegration();