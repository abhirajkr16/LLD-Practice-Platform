// test/domain-test.js


const Problem = require("../src/domain/problem/Problem");

const Attempt = require("../src/domain/attempt/Attempt");

const DesignEvidence = require("../src/domain/submission/DesignEvidence");

const Submission = require("../src/domain/submission/Submission");

const Evaluation = require("../src/domain/evaluation/Evaluation");

const FeedbackReport = require("../src/domain/feedback/FeedbackReport");

const EvaluationFailure = require("../src/domain/evaluation/EvaluationFailure");

// ============================================================================
// STEP 1: CREATE A PROBLEM
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 1: CREATE A PROBLEM");
console.log("=".repeat(70));
console.log();

const parkingLotProblem = new Problem({
    id: "parking-lot-001",
    title: "Design a Parking Lot System",
    statement: "Design a parking lot that handles vehicle entry, exit, and payment.",
    difficulty: "medium",

    requirements: [
        "Vehicles can enter and exit",
        "Track available spots",
        "Different vehicle types"
    ],

    constraints: [
        "Single parking lot",
        "No reservations"
    ],

    scope: {
        inScope: [
            "Entry/Exit management",
            "Spot tracking",
            "Fee calculation"
        ],
        outOfScope: [
            "Reservations",
            "Payment gateway integration"
        ]
    },

    edgeCases: [
        "Full capacity",
        "Oversized vehicles"
    ],

    intent: "Test OOP design and responsibility allocation",

    changeScenario: "What if multiple floors are added?"
});

console.log("Problem created:");
console.log("ID:", parkingLotProblem.getId());
console.log("Title:", parkingLotProblem.getTitle());
console.log("Difficulty:", parkingLotProblem.getDifficulty());
console.log("Requirements:", parkingLotProblem.getRequirements());
console.log();

// ============================================================================
// STEP 2: CREATE THE FIRST ATTEMPT
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 2: CREATE THE FIRST ATTEMPT");
console.log("=".repeat(70));
console.log();

const firstAttempt = new Attempt({
    id: "attempt-001",
    problemId: parkingLotProblem.getId(),
    predecessorAttemptId: null,
    createdAt: new Date("2026-09-09T10:00:00Z")
});

console.log("First Attempt:");
console.log("ID:", firstAttempt.getId());
console.log("Problem ID:", firstAttempt.getProblemId());
console.log("Has predecessor:", firstAttempt.hasPredecessor());
console.log("Created At:", firstAttempt.getCreatedAt());
console.log();

// ============================================================================
// STEP 3: CREATE THE LEARNER'S DESIGN EVIDENCE
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 3: CREATE THE LEARNER'S DESIGN EVIDENCE");
console.log("=".repeat(70));
console.log();

const designEvidence = new DesignEvidence({
    entities: [
        {
            name: "ParkingLot",
            purpose: "Manages parking spots and vehicle entry and exit"
        },
        {
            name: "ParkingSpot",
            purpose: "Represents an individual parking spot"
        },
        {
            name: "Vehicle",
            purpose: "Represents a vehicle entering the parking lot"
        }
    ],

    responsibilities: [
        {
            entity: "ParkingLot",
            responsibility: "Assign an available parking spot"
        },
        {
            entity: "ParkingSpot",
            responsibility: "Track whether the spot is occupied"
        }
    ],

    relationships: [
        {
            from: "ParkingLot",
            to: "ParkingSpot",
            type: "manages"
        }
    ],

    behaviors: [
        {
            name: "parkVehicle",
            description: "Assign an available spot to a vehicle"
        }
    ],

    designDecisions: [
        {
            statement: "ParkingLot manages parking spots",
            rationale: "Keeps parking allocation responsibility in one place"
        }
    ],

    interfaces: [],

    assumptions: [
        "The parking lot has a fixed number of spots"
    ]
});

console.log("Design evidence created.");
console.log(
    "Entities:",
    designEvidence.getEntities().map(entity => entity.name)
);
console.log();

// ============================================================================
// STEP 4: CREATE THE SUBMISSION
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 4: CREATE THE SUBMISSION");
console.log("=".repeat(70));
console.log();

const submission = new Submission({
    id: "submission-001",
    attemptId: firstAttempt.getId(),
    designEvidence
});

console.log("Submission created:");
console.log("ID:", submission.getId());
console.log("Attempt ID:", submission.getAttemptId());
console.log();

// ============================================================================
// STEP 5: CREATE AN EVALUATION
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 5: CREATE AN EVALUATION");
console.log("=".repeat(70));
console.log();

const evaluation = new Evaluation({
    id: "evaluation-001",
    attemptId: firstAttempt.getId(),
    submissionId: submission.getId(),
    evaluatorKind: "llm"
});

console.log("Evaluation created:");
console.log("Status:", evaluation.getStatus());
console.log();

// ============================================================================
// STEP 6: COMPLETE THE EVALUATION WITH FEEDBACK
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 6: COMPLETE THE EVALUATION WITH FEEDBACK");
console.log("=".repeat(70));
console.log();

const feedback = new FeedbackReport({
    overallAssessment: "The design has a clear responsibility structure.",

    dimensionFindings: [
        {
            dimension: "Requirement Coverage",
            level: "Adequate",
            evidence: "The design covers vehicle entry, exit, and parking spots."
        },
        {
            dimension: "Responsibility Assignment",
            level: "Strong",
            evidence: "Parking allocation is handled by ParkingLot."
        }
    ],

    priorityFindings: [
        {
            finding: "Clarify fee calculation responsibility",
            evidence: "The current design does not identify a dedicated fee calculation responsibility."
        }
    ],

    secondaryFindings: [],

    optionalFindings: []
});

const completedEvaluation = evaluation.complete(feedback);

console.log("Evaluation completed:");
console.log("Status:", completedEvaluation.getStatus());
console.log(
    "Overall feedback:",
    completedEvaluation.getFeedback().getOverallAssessment()
);
console.log();

// ============================================================================
// STEP 7: TEST EVALUATION FAILURE AND RETRY
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 7: TEST EVALUATION FAILURE AND RETRY");
console.log("=".repeat(70));
console.log();

const failedEvaluation = new Evaluation({
    id: "evaluation-002",
    attemptId: firstAttempt.getId(),
    submissionId: submission.getId(),
    evaluatorKind: "llm"
});

const failure = new EvaluationFailure({
    code: "EVALUATOR_TIMEOUT",
    message: "The evaluator did not respond within the allowed time."
});

const evaluationWithFailure = failedEvaluation.fail(failure);

console.log("Failed evaluation status:");
console.log(evaluationWithFailure.getStatus());

console.log("Can retry:", evaluationWithFailure.canRetry());

const retriedEvaluation = evaluationWithFailure.retry();

console.log("Status after retry:");
console.log(retriedEvaluation.getStatus());
console.log();

// ============================================================================
// STEP 8: CREATE A SECOND ATTEMPT FOR EDIT & TRY AGAIN
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 8: CREATE A SECOND ATTEMPT FOR EDIT & TRY AGAIN");
console.log("=".repeat(70));
console.log();

const secondAttempt = new Attempt({
    id: "attempt-002",
    problemId: parkingLotProblem.getId(),
    predecessorAttemptId: firstAttempt.getId(),
    createdAt: new Date("2026-09-09T14:00:00Z")
});

console.log("Second Attempt:");
console.log("ID:", secondAttempt.getId());
console.log("Problem ID:", secondAttempt.getProblemId());
console.log(
    "Predecessor ID:",
    secondAttempt.getPredecessorAttemptId()
);
console.log("Is revision:", secondAttempt.hasPredecessor());
console.log();

// ============================================================================
// STEP 9: TEST JSON SERIALIZATION
// ============================================================================

console.log("=".repeat(70));
console.log("STEP 9: TEST JSON SERIALIZATION");
console.log("=".repeat(70));
console.log();

console.log(
    JSON.stringify(
        {
            problem: parkingLotProblem,
            firstAttempt,
            submission,
            evaluation: completedEvaluation,
            secondAttempt
        },
        null,
        2
    )
);
console.log();

// ============================================================================
// TEST COMPLETED
// ============================================================================

console.log("=".repeat(70));
console.log("DOMAIN MODEL TEST COMPLETED");
console.log("=".repeat(70));