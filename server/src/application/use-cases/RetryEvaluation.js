/**
 * Retries a failed evaluation for an existing attempt.
 *
 * Retrying evaluation does not create a new Attempt or Submission.
 * It only moves the existing Evaluation back to the evaluating state.
 */

class RetryEvaluation {
  constructor({
    attemptRepository,
    submissionRepository,
    evaluationRepository,
    evaluator,
    problemRepository,
  }) {
    this.attemptRepository = attemptRepository;
    this.submissionRepository = submissionRepository;
    this.evaluationRepository = evaluationRepository;
    this.evaluator = evaluator;
    this.problemRepository = problemRepository;
  }

  async execute({ attemptId }) {
    const attempt = await this.attemptRepository.findById(attemptId);

    if (!attempt) {
      const error = new Error("Attempt not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    const submission =
      await this.submissionRepository.findByAttemptId(attemptId);

    const evaluation =
      await this.evaluationRepository.findByAttemptId(attemptId);

    if (!submission || !evaluation) {
      const error = new Error("Evaluation data not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    if (!evaluation.canRetry()) {
      const error = new Error("Evaluation can only be retried after a failure");
      error.code = "INVALID_REQUEST";
      throw error;
    }

    const evaluating = evaluation.retry();
    await this.evaluationRepository.save(evaluating);

    if (!this.evaluator) {
      return evaluating.toJSON();
    }

    const problem = await this.problemRepository.findById(
      attempt.getProblemId(),
    );

    if (!problem) {
      const error = new Error("Problem not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    try {
      const feedback = this.evaluator.evaluate(problem, submission);

      const completedEvaluation = evaluating.complete(feedback);

      await this.evaluationRepository.save(completedEvaluation);

      return completedEvaluation.toJSON();
    } catch (error) {
      const failedEvaluation = evaluating.fail({
        code: "EVALUATION_FAILED",
        message: error.message,
        details: null,
      });

      await this.evaluationRepository.save(failedEvaluation);

      return failedEvaluation.toJSON();
    }
  }
}

module.exports = RetryEvaluation;
