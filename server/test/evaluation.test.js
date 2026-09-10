
const DefaultRubricPolicy = require("../src/infrastructure/evaluation/DefaultRubricPolicy");
const DeterministicEvaluator = require("../src/infrastructure/evaluation/DeterministicEvaluator");

const Problem = require("../src/domain/problem/Problem");
const Submission = require("../src/domain/submission/Submission");
const DesignEvidence = require("../src/domain/submission/DesignEvidence");

describe("Evaluation", () => {
  const problem = new Problem({
    id: "parking-lot-001",
    title: "Design a Parking Lot System",
    statement: "Design a parking lot management system.",
    difficulty: "medium",
    requirements: [
      "Support multiple parking floors",
      "Support different vehicle types",
      "Allocate suitable parking spots",
      "Track vehicle entry and exit",
      "Calculate parking fees",
    ],
    constraints: ["The design should support future changes in pricing rules"],
    scope: {
      inScope: ["Parking lot structure"],
      outOfScope: ["Payment gateway integration"],
    },
    edgeCases: ["Parking lot is full"],
    intent: "Evaluate object-oriented design.",
    changeScenario: "Pricing rules may change.",
  });

  it("should generate feedback from design evidence", () => {
    const designEvidence = new DesignEvidence({
      entities: ["ParkingLot", "ParkingFloor", "ParkingSpot", "Vehicle"],
      responsibilities: [
        "ParkingLot manages floors",
        "ParkingFloor manages spots",
        "ParkingSpot tracks occupancy",
        "Vehicle represents the vehicle",
      ],
      relationships: [
        "ParkingLot contains ParkingFloor",
        "ParkingFloor contains ParkingSpot",
      ],
      behaviors: ["Park vehicle", "Remove vehicle", "Calculate parking fee"],
      designDecisions: ["Pricing is isolated using PricingStrategy"],
      interfaces: ["PricingStrategy"],
      assumptions: ["A vehicle occupies one spot"],
    });

    const submission = new Submission({
      id: "submission-test-001",
      attemptId: "attempt-test-001",
      designEvidence,
    });

    const evaluator = new DeterministicEvaluator({
      rubricPolicy: new DefaultRubricPolicy(),
    });

    const feedback = evaluator.evaluate(problem, submission);

    expect(feedback).toBeDefined();
    expect(feedback.getOverallAssessment()).toBeDefined();

    expect(feedback.getDimensionFindings()).toHaveLength(5);

    expect(feedback.getPriorityFindings().length).toBeLessThanOrEqual(1);

    expect(feedback.getSecondaryFindings().length).toBeLessThanOrEqual(2);

    expect(feedback.getOptionalFindings().length).toBeLessThanOrEqual(2);
  });

  it("should identify missing design evidence", () => {
    const designEvidence = new DesignEvidence({
      entities: ["ParkingLot"],
      responsibilities: [],
      relationships: [],
      behaviors: [],
      designDecisions: [],
      interfaces: [],
      assumptions: [],
    });

    const submission = new Submission({
      id: "submission-test-002",
      attemptId: "attempt-test-002",
      designEvidence,
    });

    const evaluator = new DeterministicEvaluator({
      rubricPolicy: new DefaultRubricPolicy(),
    });

    const feedback = evaluator.evaluate(problem, submission);

    const findings = feedback.getDimensionFindings();

    expect(
      findings.some((finding) => finding.level === "Needs Improvement"),
    ).toBe(true);
  });
});
