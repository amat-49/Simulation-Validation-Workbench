#pragma once

#include <nlohmann/json.hpp>
#include <string>

// Result of running the simulation engine on a set of input parameters.
struct SimulationResult {
    bool success = false;
    std::string error_message;   // populated only when success == false
    nlohmann::json metrics;      // metric_name -> numeric value (only when success == true)
};

// Placeholder/simplified simulation logic.
// NOTE: These formulas do not model real physics — they exist to produce
// structured, deterministic, testable output so the rest of the team
// (backend, database, frontend) can build and test integration end-to-end.
// Swap out the math in simulation.cpp for the real model whenever it's ready;
// the input/output contract (JSON in, JSON out) does not need to change.
class SimulationEngine {
public:
    // Required parameters (all numeric):
    //   initial_velocity, mass, thrust, drag_coefficient, duration
    // Throws nothing — errors are reported via SimulationResult.success/error_message.
    SimulationResult run(const nlohmann::json& parameters);
};