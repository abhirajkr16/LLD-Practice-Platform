
const Evaluation = require("../src/domain/evaluation/Evaluation");

describe("Retry Evaluation", () => {
  it("should allow retry after evaluation failure", () => {
    const evaluation = new Evaluation({
      id: "evaluation-001",
      attemptId: "attempt-001",
      submissionId: "submission-001",
      evaluatorKind: "deterministic",
      status: "evaluation_failed",
    });

    expect(evaluation.canRetry()).toBe(true);

    const retry = evaluation.retry();

    expect(retry.getId()).toBe("evaluation-001");
    expect(retry.getAttemptId()).toBe("attempt-001");
    expect(retry.getStatus()).toBe("evaluating");
  });

  it("should not allow retry after successful evaluation", () => {
    const evaluation = new Evaluation({
      id: "evaluation-002",
      attemptId: "attempt-002",
      submissionId: "submission-002",
      evaluatorKind: "deterministic",
      status: "feedback_available",
    });

    expect(evaluation.canRetry()).toBe(false);
  });
});
