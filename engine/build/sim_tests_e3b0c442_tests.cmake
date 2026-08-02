add_test([=[SimulationEngineTest.ComputesMetricsCorrectly]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=SimulationEngineTest.ComputesMetricsCorrectly]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[SimulationEngineTest.ComputesMetricsCorrectly]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_simulation.cpp:7]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[SimulationEngineTest.FailsOnMissingParameter]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=SimulationEngineTest.FailsOnMissingParameter]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[SimulationEngineTest.FailsOnMissingParameter]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_simulation.cpp:25]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[SimulationEngineTest.FailsOnNonNumericParameter]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=SimulationEngineTest.FailsOnNonNumericParameter]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[SimulationEngineTest.FailsOnNonNumericParameter]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_simulation.cpp:39]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[SimulationEngineTest.FailsOnZeroMass]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=SimulationEngineTest.FailsOnZeroMass]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[SimulationEngineTest.FailsOnZeroMass]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_simulation.cpp:54]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[SimulationEngineTest.FailsOnNegativeDuration]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=SimulationEngineTest.FailsOnNegativeDuration]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[SimulationEngineTest.FailsOnNegativeDuration]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_simulation.cpp:69]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[ValidatorTest.PassesWhenWithinRange]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=ValidatorTest.PassesWhenWithinRange]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[ValidatorTest.PassesWhenWithinRange]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_validation.cpp:7]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[ValidatorTest.FailsWhenOutOfRange]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=ValidatorTest.FailsWhenOutOfRange]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[ValidatorTest.FailsWhenOutOfRange]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_validation.cpp:22]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[ValidatorTest.FailsWhenMetricMissingFromOutput]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=ValidatorTest.FailsWhenMetricMissingFromOutput]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[ValidatorTest.FailsWhenMetricMissingFromOutput]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_validation.cpp:35]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[ValidatorTest.OverallPassRequiresAllMetricsToPass]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=ValidatorTest.OverallPassRequiresAllMetricsToPass]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[ValidatorTest.OverallPassRequiresAllMetricsToPass]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_validation.cpp:49]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
add_test([=[ValidatorTest.EmptyExpectedMetricsProducesEmptySummary]=]  /Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build/sim_tests [==[--gtest_filter=ValidatorTest.EmptyExpectedMetricsProducesEmptySummary]==] --gtest_also_run_disabled_tests)
set_tests_properties([=[ValidatorTest.EmptyExpectedMetricsProducesEmptySummary]=]
  PROPERTIES
    
    DEF_SOURCE_LINE [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/tests/test_validation.cpp:66]==]
    WORKING_DIRECTORY [==[/Users/amataddoais/Documents/UFM/cis376/Simulation-Validation-Workbench/engine/build]==]
    SKIP_REGULAR_EXPRESSION [==[\[  SKIPPED \]]==]
    
)
set(sim_tests_TESTS [==[SimulationEngineTest.ComputesMetricsCorrectly]==] [==[SimulationEngineTest.FailsOnMissingParameter]==] [==[SimulationEngineTest.FailsOnNonNumericParameter]==] [==[SimulationEngineTest.FailsOnZeroMass]==] [==[SimulationEngineTest.FailsOnNegativeDuration]==] [==[ValidatorTest.PassesWhenWithinRange]==] [==[ValidatorTest.FailsWhenOutOfRange]==] [==[ValidatorTest.FailsWhenMetricMissingFromOutput]==] [==[ValidatorTest.OverallPassRequiresAllMetricsToPass]==] [==[ValidatorTest.EmptyExpectedMetricsProducesEmptySummary]==])
