

#include <chrono>
#include <ctime>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

#include <nlohmann/json.hpp>

#include "simulation.hpp"
#include "validation.hpp"

using json = nlohmann::json;

namespace {

// UTC timestamp in ISO 8601 (e.g. "2026-07-25T18:04:12Z"), matching typical
// SQLite TEXT timestamp columns.
std::string current_timestamp() {
    const auto now = std::chrono::system_clock::now();
    const std::time_t now_c = std::chrono::system_clock::to_time_t(now);
    std::tm utc_tm{};
#if defined(_WIN32)
    gmtime_s(&utc_tm, &now_c);
#else
    gmtime_r(&now_c, &utc_tm);
#endif
    std::ostringstream oss;
    oss << std::put_time(&utc_tm, "%Y-%m-%dT%H:%M:%SZ");
    return oss.str();
}

// Accumulates structured log entries for the ExecutionLog table.
class LogCollector {
public:
    void add(const std::string& level, const std::string& message) {
        json entry;
        entry["level"] = level;
        entry["message"] = message;
        entry["timestamp"] = current_timestamp();
        entries_.push_back(std::move(entry));
    }

    json as_json() const { return entries_; }

private:
    json entries_ = json::array();
};

json make_error_response(const std::string& scenario_name, const std::string& message,
                          const LogCollector& logs) {
    json j;
    j["scenario_name"] = scenario_name;
    j["status"] = "error";
    j["error_message"] = message;
    j["logs"] = logs.as_json();
    return j;
}

}  // namespace

int main(int argc, char** argv) {
    std::string scenario_name = "unknown";
    LogCollector logs;

    if (argc < 2) {
        logs.add("error", "No configuration file path provided.");
        std::cout << make_error_response(scenario_name,
            "No configuration file path provided. Usage: sim_engine <config.json>", logs).dump(2)
                  << std::endl;
        return 1;
    }

    const std::string config_path = argv[1];

    try {
        std::ifstream file(config_path);
        if (!file.is_open()) {
            logs.add("error", "Could not open config file: " + config_path);
            std::cout << make_error_response(scenario_name,
                "Could not open config file: " + config_path, logs).dump(2) << std::endl;
            return 1;
        }

        json config;
        try {
            file >> config;
        } catch (const json::parse_error& e) {
            logs.add("error", std::string("Invalid JSON in config file: ") + e.what());
            std::cout << make_error_response(scenario_name,
                std::string("Invalid JSON in config file: ") + e.what(), logs).dump(2) << std::endl;
            return 1;
        }

        scenario_name = config.value("scenario_name", "unknown");
        logs.add("info", "Started simulation for scenario '" + scenario_name + "'");

        if (!config.contains("parameters") || !config["parameters"].is_object()) {
            logs.add("error", "Config missing required 'parameters' object");
            std::cout << make_error_response(scenario_name,
                "Config missing required 'parameters' object", logs).dump(2) << std::endl;
            return 1;
        }

        SimulationEngine engine;
        SimulationResult sim_result = engine.run(config["parameters"]);

        if (!sim_result.success) {
            logs.add("error", "Simulation failed: " + sim_result.error_message);
            std::cout << make_error_response(scenario_name, sim_result.error_message, logs).dump(2)
                      << std::endl;
            return 1;
        }

        logs.add("info", "Simulation completed successfully");

        json output;
        output["scenario_name"] = scenario_name;
        output["status"] = "success";
        output["metrics"] = sim_result.metrics;

        if (config.contains("expected_metrics") && config["expected_metrics"].is_object()) {
            Validator validator;
            ValidationSummary summary = validator.validate(sim_result.metrics, config["expected_metrics"]);

            json validation_json = json::array();
            for (const auto& mv : summary.metric_results) {
                json entry;
                entry["metric_name"] = mv.metric_name;
                entry["found"] = mv.found;
                entry["actual_value"] = mv.actual_value;
                entry["expected_min"] = mv.expected_min;
                entry["expected_max"] = mv.expected_max;
                entry["passed"] = mv.passed;
                validation_json.push_back(entry);
            }

            output["validation_results"] = validation_json;
            output["overall_validation"] = summary.overall_passed ? "PASS" : "FAIL";
            logs.add("info", std::string("Validation completed: ") + (summary.overall_passed ? "PASS" : "FAIL"));
        } else {
            output["overall_validation"] = "NOT_EVALUATED";
            logs.add("info", "No expected_metrics provided; validation skipped");
        }

        output["logs"] = logs.as_json();

        std::cout << output.dump(2) << std::endl;
        return 0;

    } catch (const std::exception& e) {
        logs.add("error", std::string("Unexpected error: ") + e.what());
        std::cout << make_error_response(scenario_name,
            std::string("Unexpected error: ") + e.what(), logs).dump(2) << std::endl;
        return 1;
    }
}