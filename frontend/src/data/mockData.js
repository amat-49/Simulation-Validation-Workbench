export const scenarios = [
    {
        id:1,
        name:"Normal Operating Test",
        description:"Example",
        filePath:
            "../../../backend/config/scenarios/scenario1.json"
    },

    {
        id:2,
        name:"High Temperature Test",
        description:"Example",
        filePath:
            "../../../backend/config/scenarios/scenario2.json"
    },

    {
        id:3,
        name:"Low Pressure Test",
        description:"Example",
        filePath:
            "../../../backend/config/scenarios/scenario3.json"
    }
];

export const mockResults = {
  overallStatus: "PASS",
  executionTime: "2.4 seconds",
  metrics: [
    {
      name: "Temperature",
      actual: 71,
      minimum: 60,
      maximum: 80,
      status: "PASS",
    },
    {
      name: "Pressure",
      actual: 31,
      minimum: 25,
      maximum: 35,
      status: "PASS",
    },
    {
      name: "Response Time",
      actual: 2.4,
      minimum: 0,
      maximum: 3,
      status: "PASS",
    },
  ],
};

export const mockHistory = [
  {
    id: 101,
    scenario: "Normal Operating Conditions",
    date: "2026-07-24",
    duration: "2.4 seconds",
    status: "PASS",
  },
  {
    id: 102,
    scenario: "High Temperature Test",
    date: "2026-07-23",
    duration: "3.1 seconds",
    status: "FAIL",
  },
  {
    id: 103,
    scenario: "Low Pressure Test",
    date: "2026-07-22",
    duration: "2.7 seconds",
    status: "PASS",
  },
];