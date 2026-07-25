#include <gtest/gtest.h>

#include "validation.hpp"

using json = nlohmann::json;

TEST(ValidatorTest, PassesWhenWithinRange) {
    json metrics = {{"final_velocity", 18.0}};
    json expected = {
        {"final_velocity", {{"expected_min", 15.0}, {"expected_max", 20.0}}}
    };

    Validator validator;
    ValidationSummary summary = validator.validate(metrics, expected);

    ASSERT_EQ(summary.metric_results.size(), 1u);
    EXPECT_TRUE(summary.metric_results[0].found);
    EXPECT_TRUE(summary.metric_results[0].passed);
    EXPECT_TRUE(summary.overall_passed);
}

TEST(ValidatorTest, FailsWhenOutOfRange) {
    json metrics = {{"final_velocity", 5.0}};
    json expected = {
        {"final_velocity", {{"expected_min", 15.0}, {"expected_max", 20.0}}}
    };

    Validator validator;
    ValidationSummary summary = validator.validate(metrics, expected);

    EXPECT_FALSE(summary.metric_results[0].passed);
    EXPECT_FALSE(summary.overall_passed);
}

TEST(ValidatorTest, FailsWhenMetricMissingFromOutput) {
    json metrics = {{"some_other_metric", 5.0}};
    json expected = {
        {"final_velocity", {{"expected_min", 15.0}, {"expected_max", 20.0}}}
    };

    Validator validator;
    ValidationSummary summary = validator.validate(metrics, expected);

    EXPECT_FALSE(summary.metric_results[0].found);
    EXPECT_FALSE(summary.metric_results[0].passed);
    EXPECT_FALSE(summary.overall_passed);
}

TEST(ValidatorTest, OverallPassRequiresAllMetricsToPass) {
    json metrics = {
        {"final_velocity", 18.0},   // within range
        {"energy_consumed", 999.0}  // out of range
    };
    json expected = {
        {"final_velocity", {{"expected_min", 15.0}, {"expected_max", 20.0}}},
        {"energy_consumed", {{"expected_min", 190.0}, {"expected_max", 210.0}}}
    };

    Validator validator;
    ValidationSummary summary = validator.validate(metrics, expected);

    ASSERT_EQ(summary.metric_results.size(), 2u);
    EXPECT_FALSE(summary.overall_passed);
}

TEST(ValidatorTest, EmptyExpectedMetricsProducesEmptySummary) {
    json metrics = {{"final_velocity", 18.0}};
    json expected = json::object();

    Validator validator;
    ValidationSummary summary = validator.validate(metrics, expected);

    EXPECT_TRUE(summary.metric_results.empty());
    EXPECT_TRUE(summary.overall_passed);
}