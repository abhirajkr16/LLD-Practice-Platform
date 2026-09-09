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
        evaluationRepository
    }) {
        this._attemptRepository = attemptRepository;
        this._submissionRepository = submissionRepository;
        this._evaluationRepository = evaluationRepository;
    }

    async execute({ attemptId }) {
        if (
            typeof attemptId !== "string" ||
            attemptId.trim().length === 0
        ) {
            throw new Error("attemptId is required");
        }

        const normalizedAttemptId = attemptId.trim();

        const attempt =
            await this._attemptRepository.findById(
                normalizedAttemptId
            );

        if (!attempt) {
            throw new Error("Attempt not found");
        }

        const submission =
            await this._submissionRepository.findByAttemptId(
                normalizedAttemptId
            );

        if (!submission) {
            throw new Error("Submission not found");
        }

        const evaluation =
            await this._evaluationRepository.findByAttemptId(
                normalizedAttemptId
            );

        if (!evaluation) {
            throw new Error("Evaluation not found");
        }

        if (!evaluation.canRetry()) {
            throw new Error(
                "Only a failed evaluation can be retried"
            );
        }

        const retriedEvaluation = evaluation.retry();

        await this._evaluationRepository.save(
            retriedEvaluation
        );

        return retriedEvaluation.toJSON();
    }
}

module.exports = RetryEvaluation;