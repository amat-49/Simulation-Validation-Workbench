#include "validation.hpp"

using json = nlohmann::json;

ValidationSummary Validator::validate(const json& metrics, const json& expected_metrics) {
    ValidationSummary summary;
    summary.overall_passed = true;

    for (auto it = expected_metrics.begin(); it != expected_metrics.end(); ++it) {
        const std::string metric_name = it.key();
        const json& bounds = it.value();

        MetricValidation mv;
        mv.metric_name = metric_name;
        mv.expected_min = bounds.value("expected_min", 0.0);
        mv.expected_max = bounds.value("expected_max", 0.0);

        if (metrics.contains(metric_name) && metrics.at(metric_name).is_number()) {
            mv.found = true;
            mv.actual_value = metrics.at(metric_name).get<double>();
            mv.passed = (mv.actual_value >= mv.expected_min) && (mv.actual_value <= mv.expected_max);
        } else {
            mv.found = false;
            mv.actual_value = 0.0;
            mv.passed = false;
        }

        if (!mv.passed) {
            summary.overall_passed = false;
        }

        summary.metric_results.push_back(mv);
    }

    return summary;
}