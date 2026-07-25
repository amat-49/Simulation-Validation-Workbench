#include "simulation.hpp"

#include <stdexcept>

using json = nlohmann::json;

SimulationResult SimulationEngine::run(const json& parameters) {
    SimulationResult result;

    try {
        auto get_required = [&](const std::string& key) -> double {
            if (!parameters.contains(key)) {
                throw std::runtime_error("Missing required parameter: " + key);
            }
            if (!parameters[key].is_number()) {
                throw std::runtime_error("Parameter '" + key + "' must be numeric");
            }
            return parameters[key].get<double>();
        };

        const double initial_velocity  = get_required("initial_velocity");
        const double mass              = get_required("mass");
        const double thrust            = get_required("thrust");
        const double drag_coefficient  = get_required("drag_coefficient");
        const double duration          = get_required("duration");

        if (mass <= 0.0) {
            throw std::runtime_error("Parameter 'mass' must be greater than zero");
        }
        if (duration < 0.0) {
            throw std::runtime_error("Parameter 'duration' cannot be negative");
        }

        // --- Placeholder physics (see header note) ---
        const double acceleration = (thrust - drag_coefficient) / mass;
        const double final_velocity = initial_velocity + acceleration * duration;
        const double distance_traveled =
            initial_velocity * duration + 0.5 * acceleration * duration * duration;
        const double energy_consumed = thrust * duration;

        result.metrics = json::object();
        result.metrics["final_velocity"] = final_velocity;
        result.metrics["distance_traveled"] = distance_traveled;
        result.metrics["energy_consumed"] = energy_consumed;
        result.success = true;

    } catch (const std::exception& e) {
        result.success = false;
        result.error_message = e.what();
    }

    return result;
}