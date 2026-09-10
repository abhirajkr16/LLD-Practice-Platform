const Attempt = require("../../domain/attempt/Attempt");
const DesignEvidence = require("../../domain/submission/DesignEvidence");
const Submission = require("../../domain/submission/Submission");
const Evaluation = require("../../domain/evaluation/Evaluation");

/**
 * Handles submission of a learner's LLD design.
 *
 * The use case coordinates the creation of an Attempt, Submission,
 * and initial Evaluation after the problem has been validated.
 *
 * It does not perform the actual evaluation itself.
 */
class SubmitDesign {
  constructor({
    problemRepository,
    attemptRepository,
    submissionRepository,
    evaluationRepository,
    idGenerator,
    unitOfWork,
  }) {
    this._problemRepository = problemRepository;
    this._attemptRepository = attemptRepository;
    this._submissionRepository = submissionRepository;
    this._evaluationRepository = evaluationRepository;
    this._idGenerator = idGenerator;
    this._unitOfWork = unitOfWork;
  }

  async execute({ problemId, designEvidence, predecessorAttemptId = null }) {
    if (typeof problemId !== "string" || problemId.trim().length === 0) {
      throw new Error("problemId is required");
    }

    const problem = await this._problemRepository.findById(problemId.trim());

    if (!problem) {
      throw new Error("Problem not found");
    }

    const evidence = new DesignEvidence(designEvidence);

    if (predecessorAttemptId !== null) {
      const predecessor =
        await this._attemptRepository.findById(predecessorAttemptId);

      if (!predecessor) {
        throw new Error("Predecessor attempt not found");
      }

      if (predecessor.getProblemId() !== problemId.trim()) {
        throw new Error("Predecessor attempt belongs to another problem");
      }
    }

    const attempt = new Attempt({
      id: this._idGenerator.generate("attempt"),
      problemId: problemId.trim(),
      predecessorAttemptId,
    });

    const submission = new Submission({
      id: this._idGenerator.generate("submission"),
      attemptId: attempt.getId(),
      designEvidence: evidence,
    });

    const evaluation = new Evaluation({
      id: this._idGenerator.generate("evaluation"),
      attemptId: attempt.getId(),
      submissionId: submission.getId(),
      evaluatorKind: "default",
    });

    await this._unitOfWork.transaction(() => {
      this._attemptRepository.save(attempt);
      this._submissionRepository.save(submission);
      this._evaluationRepository.save(evaluation);
    });

    return {
      attempt: attempt.toJSON(),
      submission: submission.toJSON(),
      evaluation: evaluation.toJSON(),
    };
  }
}

module.exports = SubmitDesign;
