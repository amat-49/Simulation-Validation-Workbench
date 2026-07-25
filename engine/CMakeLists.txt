cmake_minimum_required(VERSION 3.14)
project(simulation_engine CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

include(FetchContent)
if(POLICY CMP0135)
  cmake_policy(SET CMP0135 NEW)
endif()

# --- nlohmann/json (header-only) ---
FetchContent_Declare(
  json
  URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(json)

# --- Core library: simulation + validation logic ---
add_library(sim_core
  src/simulation.cpp
  src/validation.cpp
)
target_include_directories(sim_core PUBLIC src)
target_link_libraries(sim_core PUBLIC nlohmann_json::nlohmann_json)

# --- Executable: what Person 2 (Node.js) will spawn as a child process ---
add_executable(sim_engine src/main.cpp)
target_link_libraries(sim_engine PRIVATE sim_core)

# --- Tests ---
option(BUILD_TESTS "Build unit tests" ON)
if(BUILD_TESTS)
  enable_testing()

  FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.tar.gz
  )
  set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
  FetchContent_MakeAvailable(googletest)

  add_executable(sim_tests
    tests/test_simulation.cpp
    tests/test_validation.cpp
  )
  target_link_libraries(sim_tests PRIVATE sim_core gtest_main)

  include(GoogleTest)
  gtest_discover_tests(sim_tests)
endif()