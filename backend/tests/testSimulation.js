const { runSimulation } = require("../ipc/simulationHandler");

async function test() {

    const result = await runSimulation(
        "../config/scenarios/scenario1.json",
        1
    );

    console.log(result);

}

test();