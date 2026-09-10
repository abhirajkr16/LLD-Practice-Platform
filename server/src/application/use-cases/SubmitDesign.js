/**
 * Handles submission of a learner's LLD design.
 *
 * The use case coordinates the creation of an Attempt, Submission,
 * and initial Evaluation after the problem has been validated.
 *
 * It does not perform the actual evaluation itself.
 */

const Attempt = require("../../domain/attempt/Attempt");
const DesignEvidence = require("../../domain/submission/DesignEvidence");
const Submission = require("../../domain/submission/Submission");
const Evaluation = require("../../domain/evaluation/Evaluation");
const SubmissionValidator = require("../../domain/submission/SubmissionValidator");

class SubmitDesign {
  constructor({
    problemRepository,
    attemptRepository,
    submissionRepository,
    evaluationRepository,
    idGenerator,
    unitOfWork,
    evaluator,
  }) {
    this.problemRepository = problemRepository;
    this.attemptRepository = attemptRepository;
    this.submissionRepository = submissionRepository;
    this.evaluationRepository = evaluationRepository;
    this.idGenerator = idGenerator;
    this.unitOfWork = unitOfWork;
    this.evaluator = evaluator;
  }

  async execute({ problemId, designEvidence, predecessorAttemptId = null }) {
    const problem = await this.problemRepository.findById(problemId);

    if (!problem) {
      const error = new Error("Problem not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    const evidence = new DesignEvidence(designEvidence);

    const validator = new SubmissionValidator();
    validator.validate(evidence);

    if (predecessorAttemptId) {
      const previousAttempt =
        await this.attemptRepository.findById(predecessorAttemptId);

      if (!previousAttempt) {
        const error = new Error("Predecessor attempt not found");
        error.code = "INVALID_PREDECESSOR_ATTEMPT";
        throw error;
      }

      if (previousAttempt.getProblemId() !== problemId) {
        const error = new Error(
          "Predecessor attempt belongs to another problem",
        );
        error.code = "INVALID_PREDECESSOR_ATTEMPT";
        throw error;
      }
    }

    const generateId = (type) => {
      if (typeof this.idGenerator === "function") {
        return this.idGenerator(type);
      }
      if (this.idGenerator && typeof this.idGenerator.generate === "function") {
        return this.idGenerator.generate(type);
      }
      return `${type}-${Date.now()}`;
    };

    const attempt = new Attempt({
      id: generateId("attempt"),
      problemId,
      predecessorAttemptId,
    });

    const submission = new Submission({
      id: generateId("submission"),
      attemptId: attempt.getId(),
      designEvidence: evidence,
    });

    const evaluation = new Evaluation({
      id: generateId("evaluation"),
      attemptId: attempt.getId(),
      submissionId: submission.getId(),
      evaluatorKind: "deterministic",
      status: "evaluating",
    });

    await this.unitOfWork.transaction(() => {
      this.attemptRepository.save(attempt);
      this.submissionRepository.save(submission);
      this.evaluationRepository.save(evaluation);
    });

    if (!this.evaluator) {
      return {
        attempt: attempt.toJSON(),
        submission: submission.toJSON(),
        evaluation: evaluation.toJSON(),
      };
    }

    try {
      const feedback = this.evaluator.evaluate(problem, submission);

      const completedEvaluation = evaluation.complete(feedback);

      this.evaluationRepository.save(completedEvaluation);

      return {
        attempt: attempt.toJSON(),
        submission: submission.toJSON(),
        evaluation: completedEvaluation.toJSON(),
      };
    } catch (error) {
      const failedEvaluation = evaluation.fail({
        code: "EVALUATION_FAILED",
        message: error.message,
        details: null,
      });

      this.evaluationRepository.save(failedEvaluation);

      return {
        attempt: attempt.toJSON(),
        submission: submission.toJSON(),
        evaluation: failedEvaluation.toJSON(),
      };
    }
  }
}

module.exports = SubmitDesign;
