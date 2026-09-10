/**
 * Retrieves an attempt together with its submission and evaluation.
 *
 * The use case combines the objects that make up an attempt's
 * current practice state for the application/API layer.
 */
class GetAttempt {
  constructor({
    attemptRepository,
    submissionRepository,
    evaluationRepository,
  }) {
    this._attemptRepository = attemptRepository;
    this._submissionRepository = submissionRepository;
    this._evaluationRepository = evaluationRepository;
  }

  async execute({ attemptId }) {
    if (typeof attemptId !== "string" || attemptId.trim().length === 0) {
      throw new Error("attemptId is required");
    }

    const normalizedAttemptId = attemptId.trim();

    const attempt = await this._attemptRepository.findById(normalizedAttemptId);

    if (!attempt) {
      throw new Error("Attempt not found");
    }

    const submission =
      await this._submissionRepository.findByAttemptId(normalizedAttemptId);

    const evaluation =
      await this._evaluationRepository.findByAttemptId(normalizedAttemptId);

    return {
      attempt: attempt.toJSON(),
      submission: submission ? submission.toJSON() : null,
      evaluation: evaluation ? evaluation.toJSON() : null,
    };
  }
}

module.exports = GetAttempt;
