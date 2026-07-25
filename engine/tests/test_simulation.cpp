#include <gtest/gtest.h>

#include "simulation.hpp"

using json = nlohmann::json;

TEST(SimulationEngineTest, ComputesMetricsCorrectly) {
    json params = {
        {"initial_velocity", 0.0},
        {"mass", 10.0},
        {"thrust", 50.0},
        {"drag_coefficient", 5.0},
        {"duration", 4.0}
    };

    SimulationEngine engine;
    SimulationResult result = engine.run(params);

    ASSERT_TRUE(result.success);
    EXPECT_DOUBLE_EQ(result.metrics["final_velocity"].get<double>(), 18.0);
    EXPECT_DOUBLE_EQ(result.metrics["distance_traveled"].get<double>(), 36.0);
    EXPECT_DOUBLE_EQ(result.metrics["energy_consumed"].get<double>(), 200.0);
}

TEST(SimulationEngineTest, FailsOnMissingParameter) {
    json params = {
        {"initial_velocity", 0.0},
        {"mass", 10.0}
        // thrust, drag_coefficient, duration intentionally omitted
    };

    SimulationEngine engine;
    SimulationResult result = engine.run(params);

    ASSERT_FALSE(result.success);
    EXPECT_FALSE(result.error_message.empty());
}

TEST(SimulationEngineTest, FailsOnNonNumericParameter) {
    json params = {
        {"initial_velocity", 0.0},
        {"mass", "heavy"},  // wrong type
        {"thrust", 50.0},
        {"drag_coefficient", 5.0},
        {"duration", 4.0}
    };

    SimulationEngine engine;
    SimulationResult result = engine.run(params);

    ASSERT_FALSE(result.success);
}

TEST(SimulationEngineTest, FailsOnZeroMass) {
    json params = {
        {"initial_velocity", 0.0},
        {"mass", 0.0},
        {"thrust", 50.0},
        {"drag_coefficient", 5.0},
        {"duration", 4.0}
    };

    SimulationEngine engine;
    SimulationResult result = engine.run(params);

    ASSERT_FALSE(result.success);
}

TEST(SimulationEngineTest, FailsOnNegativeDuration) {
    json params = {
        {"initial_velocity", 0.0},
        {"mass", 10.0},
        {"thrust", 50.0},
        {"drag_coefficient", 5.0},
        {"duration", -1.0}
    };

    SimulationEngine engine;
    SimulationResult result = engine.run(params);

    ASSERT_FALSE(result.success);
}