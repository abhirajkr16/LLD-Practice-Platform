const db = require("../src/database/connection");

const SQLiteProblemRepository = require("../src/infrastructure/repositories/SQLiteProblemRepository");
const SQLiteAttemptRepository = require("../src/infrastructure/repositories/SQLiteAttemptRepository");

async function runTests() {
    console.log("Starting infrastructure tests...\n");

    const problemRepository = new SQLiteProblemRepository({ db });
    const attemptRepository = new SQLiteAttemptRepository({ db });

    console.log("STEP 1: TEST FIND ALL PROBLEMS");

    const problems = await problemRepository.findAll();

    console.log("Problems found:", problems.length);
    console.log(
        "Problem IDs:",
        problems.map(problem => problem.getId())
    );

    if (problems.length !== 2) {
        throw new Error("Expected 2 seeded problems");
    }

    console.log("findAll test passed.\n");

    console.log("STEP 2: TEST FIND PROBLEM");

    const problem = await problemRepository.findById("parking-lot-001");

    if (!problem) {
        throw new Error("Parking Lot problem not found");
    }

    console.log("Problem title:", problem.getTitle());
    console.log("Domain object:", problem.constructor.name);

    if (problem.constructor.name !== "Problem") {
        throw new Error("Repository did not return Problem domain object");
    }

    console.log("findById test passed.\n");

    console.log("STEP 3: TEST UNKNOWN PROBLEM");

    const unknownProblem =
        await problemRepository.findById("does-not-exist");

    if (unknownProblem !== null) {
        throw new Error("Unknown problem should return null");
    }

    console.log("Unknown problem correctly returned null.\n");

    console.log("STEP 4: TEST ATTEMPT LOOKUP");

    const attempts =
        await attemptRepository.findByProblemId("parking-lot-001");

    console.log("Attempts found:", attempts.length);

    if (attempts.length !== 0) {
        throw new Error("Expected no attempts yet");
    }

    console.log("Attempt repository test passed.\n");

    console.log("INFRASTRUCTURE TESTS COMPLETED SUCCESSFULLY.");
}

runTests().catch(error => {
    console.error("\nInfrastructure test failed:");
    console.error(error);
    process.exit(1);
});