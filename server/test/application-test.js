const Problem = require("../src/domain/problem/Problem");
const Attempt = require("../src/domain/attempt/Attempt");
const DesignEvidence = require("../src/domain/submission/DesignEvidence");
const Submission = require("../src/domain/submission/Submission");
const Evaluation = require("../src/domain/evaluation/Evaluation");

const ListProblems = require("../src/application/use-cases/ListProblems");
const GetProblem = require("../src/application/use-cases/GetProblem");
const GetProblemAttempts = require("../src/application/use-cases/GetProblemAttempts");
const SubmitDesign = require("../src/application/use-cases/SubmitDesign");
const GetAttempt = require("../src/application/use-cases/GetAttempt");
const RetryEvaluation = require("../src/application/use-cases/RetryEvaluation");

/*
 * In-memory repositories are used here so that we can test
 * application logic without involving SQLite.
 */

class FakeProblemRepository {
  constructor(problems = []) {
    this._problems = problems;
  }

  async findAll() {
    return this._problems;
  }

  async findById(problemId) {
    return this._problems.find((problem) => problem.getId() === problemId);
  }
}

class FakeAttemptRepository {
  constructor(attempts = []) {
    this._attempts = attempts;
  }

  async findByProblemId(problemId) {
    return this._attempts.filter(
      (attempt) => attempt.getProblemId() === problemId,
    );
  }

  async findById(attemptId) {
    return this._attempts.find((attempt) => attempt.getId() === attemptId);
  }

  async save(attempt) {
    this._attempts.push(attempt);
    return attempt;
  }
}

class FakeSubmissionRepository {
  constructor(submissions = []) {
    this._submissions = submissions;
  }

  async findByAttemptId(attemptId) {
    return this._submissions.find(
      (submission) => submission.getAttemptId() === attemptId,
    );
  }

  async save(submission) {
    this._submissions.push(submission);
    return submission;
  }
}

class FakeEvaluationRepository {
  constructor(evaluations = []) {
    this._evaluations = evaluations;
  }

  async findByAttemptId(attemptId) {
    return this._evaluations.find(
      (evaluation) => evaluation.getAttemptId() === attemptId,
    );
  }

  async save(evaluation) {
    const existingIndex = this._evaluations.findIndex(
      (existing) => existing.getId() === evaluation.getId(),
    );

    if (existingIndex === -1) {
      this._evaluations.push(evaluation);
    } else {
      this._evaluations[existingIndex] = evaluation;
    }

    return evaluation;
  }
}

class FakeIdGenerator {
  constructor() {
    this._counter = 0;
  }

  generate(prefix) {
    this._counter += 1;
    return `${prefix}-test-${this._counter}`;
  }
}

const parkingLotProblem = new Problem({
  id: "parking-lot-001",
  title: "Design a Parking Lot System",
  statement:
    "Design a parking lot that handles vehicle entry, exit, and payment.",
  difficulty: "medium",
  requirements: ["Vehicles can enter and exit", "Track available spots"],
  constraints: ["Single parking lot"],
  scope: {
    inScope: ["Parking management"],
    outOfScope: ["Payment gateway"],
  },
  edgeCases: ["Full capacity"],
  intent: "Test OOP design",
  changeScenario: "What if multiple floors are added?",
});

const elevatorProblem = new Problem({
  id: "elevator-001",
  title: "Design an Elevator System",
  statement: "Design an elevator system that manages requests and movement.",
  difficulty: "hard",
  requirements: ["Handle elevator requests", "Move between floors"],
  constraints: ["Multiple floors"],
  scope: {
    inScope: ["Elevator movement"],
    outOfScope: ["Emergency systems"],
  },
  edgeCases: ["Multiple simultaneous requests"],
  intent: "Test state management",
});

async function runTests() {
  console.log("Starting application layer tests...\n");

  const problemRepository = new FakeProblemRepository([
    parkingLotProblem,
    elevatorProblem,
  ]);

  /*
   * Test 1: ListProblems
   */
  console.log("STEP 1: TEST LIST PROBLEMS");

  const listProblems = new ListProblems({
    problemRepository,
  });

  const problems = await listProblems.execute();

  console.log("Number of problems:", problems.length);
  console.log(
    "Problem IDs:",
    problems.map((problem) => problem.id),
  );

  if (problems.length !== 2) {
    throw new Error("ListProblems test failed");
  }

  console.log("ListProblems test passed.\n");

  /*
   * Test 2: GetProblem
   */
  console.log("STEP 2: TEST GET PROBLEM");

  const getProblem = new GetProblem({
    problemRepository,
  });

  const problem = await getProblem.execute({
    problemId: "parking-lot-001",
  });

  console.log("Problem ID:", problem.id);
  console.log("Problem title:", problem.title);

  if (problem.id !== "parking-lot-001") {
    throw new Error("GetProblem test failed");
  }

  console.log("GetProblem test passed.\n");

  /*
   * Test 3: GetProblem with an unknown ID
   */
  console.log("STEP 3: TEST UNKNOWN PROBLEM");

  try {
    await getProblem.execute({
      problemId: "does-not-exist",
    });

    throw new Error("GetProblem should have rejected an unknown problem");
  } catch (error) {
    if (error.message !== "Problem not found") {
      throw error;
    }

    console.log("Unknown problem correctly rejected.");
  }

  console.log();

  /*
   * Prepare attempts for the next tests.
   */
  const firstAttempt = new Attempt({
    id: "attempt-001",
    problemId: "parking-lot-001",
    predecessorAttemptId: null,
    createdAt: new Date("2026-09-09T10:00:00Z"),
  });

  const secondAttempt = new Attempt({
    id: "attempt-002",
    problemId: "parking-lot-001",
    predecessorAttemptId: "attempt-001",
    createdAt: new Date("2026-09-09T14:00:00Z"),
  });

  const attemptRepository = new FakeAttemptRepository([
    firstAttempt,
    secondAttempt,
  ]);

  /*
   * Test 4: GetProblemAttempts
   */
  console.log("STEP 4: TEST GET PROBLEM ATTEMPTS");

  const getProblemAttempts = new GetProblemAttempts({
    attemptRepository,
    problemRepository,
  });

  const attempts = await getProblemAttempts.execute({
    problemId: "parking-lot-001",
  });

  console.log("Number of attempts:", attempts.length);
  console.log(
    "Attempt IDs:",
    attempts.map((attempt) => attempt.id),
  );

  if (attempts.length !== 2) {
    throw new Error("GetProblemAttempts test failed");
  }

  console.log("GetProblemAttempts test passed.\n");

  /*
   * Test 5: SubmitDesign
   */
  console.log("STEP 5: TEST SUBMIT DESIGN");

  const submissionRepository = new FakeSubmissionRepository();
  const evaluationRepository = new FakeEvaluationRepository();
  const fakeUnitOfWork = {
    transaction(work) {
        return work();
    }
};
  const idGenerator = new FakeIdGenerator();

  const submitDesign = new SubmitDesign({
    problemRepository,
    attemptRepository,
    submissionRepository,
    evaluationRepository,
    idGenerator,
    unitOfWork: fakeUnitOfWork,
  });

  const submissionResult = await submitDesign.execute({
    problemId: "parking-lot-001",

    designEvidence: {
      entities: [
        {
          name: "ParkingLot",
          purpose: "Manages parking spots",
        },
        {
          name: "ParkingSpot",
          purpose: "Represents a parking spot",
        },
      ],

      responsibilities: [
        {
          entity: "ParkingLot",
          responsibility: "Assign available parking spots",
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
          description: "Assign a vehicle to a parking spot",
        },
      ],

      designDecisions: [
        {
          statement: "ParkingLot manages parking spots",
          rationale: "Centralizes parking allocation",
        },
      ],

      interfaces: [],

      assumptions: ["The parking lot has fixed capacity"],
    },
  });

  console.log("Attempt ID:", submissionResult.attempt.id);
  console.log("Submission ID:", submissionResult.submission.id);
  console.log("Evaluation status:", submissionResult.evaluation.status);

  if (submissionResult.evaluation.status !== "evaluating") {
    throw new Error("SubmitDesign test failed");
  }

  if (submissionRepository._submissions.length !== 1) {
    throw new Error("Submission was not persisted");
  }

  if (evaluationRepository._evaluations.length !== 1) {
    throw new Error("Evaluation was not persisted");
  }

  console.log("SubmitDesign test passed.\n");

  /*
   * Test 6: SubmitDesign with an invalid predecessor
   */
  console.log("STEP 6: TEST INVALID PREDECESSOR");

  try {
    await submitDesign.execute({
      problemId: "parking-lot-001",
      predecessorAttemptId: "does-not-exist",
      designEvidence: {
        entities: [],
        responsibilities: [],
        relationships: [],
        behaviors: [],
        designDecisions: [],
      },
    });

    throw new Error("SubmitDesign should have rejected invalid predecessor");
  } catch (error) {
    if (error.message !== "Predecessor attempt not found") {
      throw error;
    }

    console.log("Invalid predecessor correctly rejected.");
  }

  console.log();

  /*
   * Prepare data for GetAttempt and RetryEvaluation.
   */
  const storedAttempt = submissionResult.attempt;
  const storedSubmission = submissionResult.submission;

  /*
   * Test 7: GetAttempt
   */
  console.log("STEP 7: TEST GET ATTEMPT");

  const getAttempt = new GetAttempt({
    attemptRepository,
    submissionRepository,
    evaluationRepository,
  });

  const attemptDetails = await getAttempt.execute({
    attemptId: storedAttempt.id,
  });

  console.log("Attempt ID:", attemptDetails.attempt.id);
  console.log("Submission ID:", attemptDetails.submission.id);
  console.log("Evaluation status:", attemptDetails.evaluation.status);

  if (attemptDetails.attempt.id !== storedAttempt.id) {
    throw new Error("GetAttempt test failed");
  }

  console.log("GetAttempt test passed.\n");

  /*
   * Test 8: RetryEvaluation
   *
   * First make the stored evaluation fail, then retry it.
   */
  console.log("STEP 8: TEST RETRY EVALUATION");

  const storedEvaluation = await evaluationRepository.findByAttemptId(
    storedAttempt.id,
  );

  const failedEvaluation = storedEvaluation.fail({
    code: "EVALUATOR_TIMEOUT",
    message: "Evaluator timed out",
  });

  await evaluationRepository.save(failedEvaluation);

  const retryEvaluation = new RetryEvaluation({
    attemptRepository,
    submissionRepository,
    evaluationRepository,
  });

  const retriedEvaluation = await retryEvaluation.execute({
    attemptId: storedAttempt.id,
  });

  console.log("Evaluation status after retry:", retriedEvaluation.status);

  if (retriedEvaluation.status !== "evaluating") {
    throw new Error("RetryEvaluation test failed");
  }

  console.log("RetryEvaluation test passed.\n");

  console.log("Application layer tests completed successfully.");
}

runTests().catch((error) => {
  console.error("\nApplication layer test failed:");
  console.error(error);
  process.exit(1);
});
