const db = require("../src/database/connection");

const SQLiteProblemRepository = require("../src/infrastructure/repositories/SQLiteProblemRepository");
const SQLiteAttemptRepository = require("../src/infrastructure/repositories/SQLiteAttemptRepository");
const SQLiteSubmissionRepository = require("../src/infrastructure/repositories/SQLiteSubmissionRepository");
const SQLiteEvaluationRepository = require("../src/infrastructure/repositories/SQLiteEvaluationRepository");
const SQLiteUnitOfWork = require("../src/infrastructure/database/SQLiteUnitOfWork");

const SubmitDesign = require("../src/application/use-cases/SubmitDesign");
const GetAttempt = require("../src/application/use-cases/GetAttempt");

class TestIdGenerator {
  generate(type) {
    return `${type}-integration-001`;
  }
}

async function runTests() {
  console.log("Starting real SQLite integration tests...\n");

  const problemRepository = new SQLiteProblemRepository({ db });

  const attemptRepository = new SQLiteAttemptRepository({ db });

  const submissionRepository = new SQLiteSubmissionRepository({ db });

  const evaluationRepository = new SQLiteEvaluationRepository({ db });

  const unitOfWork = new SQLiteUnitOfWork({ db });

  const idGenerator = new TestIdGenerator();

  const submitDesign = new SubmitDesign({
    problemRepository,
    attemptRepository,
    submissionRepository,
    evaluationRepository,
    idGenerator,
    unitOfWork,
  });

  const getAttempt = new GetAttempt({
    attemptRepository,
    submissionRepository,
    evaluationRepository,
  });

  console.log("STEP 1: VERIFY PARKING LOT EXISTS");

  const problem = await problemRepository.findById("parking-lot-001");

  if (!problem) {
    throw new Error("Parking Lot problem not found");
  }

  console.log("Problem:", problem.getTitle());
  console.log("Problem lookup passed.\n");

  console.log("STEP 2: SUBMIT DESIGN TO REAL SQLITE");

  const result = await submitDesign.execute({
    problemId: "parking-lot-001",

    designEvidence: {
      entities: [
        {
          name: "ParkingLot",
          purpose: "Manages parking floors",
        },
        {
          name: "ParkingSpot",
          purpose: "Tracks parking spot availability",
        },
        {
          name: "Vehicle",
          purpose: "Represents a parked vehicle",
        },
      ],

      responsibilities: [
        {
          entity: "ParkingLot",
          responsibility: "Manage parking floors and entry/exit",
        },
      ],

      relationships: [
        {
          from: "ParkingLot",
          to: "ParkingSpot",
          type: "manages",
        },
      ],

      behaviors: [
        {
          name: "parkVehicle",
          description: "Allocates a suitable parking spot",
        },
      ],

      designDecisions: [
        {
          statement: "Use a strategy for fee calculation",
          rationale: "Pricing rules may change",
        },
      ],

      interfaces: [],

      assumptions: ["One vehicle can have one active parking session"],
    },
  });

  console.log("Attempt ID:", result.attempt.id);
  console.log("Submission ID:", result.submission.id);
  console.log("Evaluation status:", result.evaluation.status);

  if (result.evaluation.status !== "evaluating") {
    throw new Error("Expected evaluation status to be evaluating");
  }

  console.log("Submission persistence passed.\n");

  console.log("STEP 3: READ ATTEMPT BACK FROM SQLITE");

  const attemptResult = await getAttempt.execute({
    attemptId: result.attempt.id,
  });

  if (!attemptResult.attempt) {
    throw new Error("Attempt was not persisted");
  }

  if (!attemptResult.submission) {
    throw new Error("Submission was not persisted");
  }

  if (!attemptResult.evaluation) {
    throw new Error("Evaluation was not persisted");
  }

  console.log("Attempt:", attemptResult.attempt.id);

  console.log("Submission:", attemptResult.submission.id);

  console.log("Evaluation:", attemptResult.evaluation.id);

  console.log("Evaluation status:", attemptResult.evaluation.status);

  console.log("Read-back persistence passed.\n");

  console.log("STEP 4: VERIFY DOMAIN OBJECTS");

  if (attemptResult.attempt.id !== result.attempt.id) {
    throw new Error("Attempt ID mismatch");
  }

  if (attemptResult.submission.id !== result.submission.id) {
    throw new Error("Submission ID mismatch");
  }

  if (attemptResult.evaluation.id !== result.evaluation.id) {
    throw new Error("Evaluation ID mismatch");
  }

  console.log("Domain mapping passed.\n");

  console.log("STEP 5: VERIFY DESIGN EVIDENCE");

  const evidence = attemptResult.submission.designEvidence;

  if (!evidence) {
    throw new Error("Design evidence missing");
  }

  if (evidence.entities.length !== 3) {
    throw new Error("Design evidence entities were not persisted correctly");
  }

  console.log(
    "Entities restored:",
    evidence.entities.map((entity) => entity.name),
  );

  console.log("Design evidence persistence passed.\n");

  console.log("STEP 6: CLEAN UP TEST DATA");

  db.prepare(
    `
        DELETE FROM evaluations
        WHERE id = ?
    `,
  ).run(result.evaluation.id);

  db.prepare(
    `
        DELETE FROM submissions
        WHERE id = ?
    `,
  ).run(result.submission.id);

  db.prepare(
    `
        DELETE FROM attempts
        WHERE id = ?
    `,
  ).run(result.attempt.id);

  console.log("Test data cleaned up.\n");

  console.log("REAL SQLITE INTEGRATION TESTS COMPLETED SUCCESSFULLY.");
}

runTests().catch((error) => {
  console.error("\nIntegration test failed:");
  console.error(error);
  process.exit(1);
});
