#pragma once

#include <nlohmann/json.hpp>
#include <string>
#include <vector>

// Pass/fail result for a single metric against its expected range.
struct MetricValidation {
    std::string metric_name;
    bool found = false;        // false if the simulation didn't produce this metric
    double actual_value = 0.0;
    double expected_min = 0.0;
    double expected_max = 0.0;
    bool passed = false;
};

struct ValidationSummary {
    std::vector<MetricValidation> metric_results;
    bool overall_passed = true;
};

// Compares simulation output metrics against expected_min/expected_max
// thresholds pulled from the scenario config.
class Validator {
public:
    // expected_metrics format:
    //   { "metric_name": { "expected_min": <num>, "expected_max": <num> }, ... }
    ValidationSummary validate(const nlohmann::json& metrics,
                                const nlohmann::json& expected_metrics);
};