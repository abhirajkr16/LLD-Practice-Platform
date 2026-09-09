/**
 * Represents the current evaluation state of an attempt.
 *
 * An Evaluation tracks whether the submission is currently being evaluated,
 * has produced usable feedback, or has failed and can be retried.
 *
 * It owns the evaluation lifecycle, but not the evaluation logic itself.
 * The actual judgment is performed through the Evaluator port.
 */
class Evaluation {
    /**
     * Creates a new Evaluation.
     *
     * @param {Object} params
     * @param {string} params.id - Unique evaluation identifier
     * @param {string} params.attemptId - Attempt being evaluated
     * @param {string} params.submissionId - Submission being evaluated
     * @param {string} params.evaluatorKind - Type of evaluator used
     * @param {string} params.status - Current evaluation status
     * @param {Object|null} params.feedback - Successful feedback report
     * @param {Object|null} params.failure - Evaluation failure details
     */
    constructor({
        id,
        attemptId,
        submissionId,
        evaluatorKind,
        status = "evaluating",
        feedback = null,
        failure = null
    }) {
        if (typeof id !== "string" || id.trim().length === 0) {
            throw new Error("Evaluation requires a non-empty id");
        }

        if (
            typeof attemptId !== "string" ||
            attemptId.trim().length === 0
        ) {
            throw new Error("Evaluation requires a non-empty attemptId");
        }

        if (
            typeof submissionId !== "string" ||
            submissionId.trim().length === 0
        ) {
            throw new Error("Evaluation requires a non-empty submissionId");
        }

        if (
            typeof evaluatorKind !== "string" ||
            evaluatorKind.trim().length === 0
        ) {
            throw new Error("Evaluation requires an evaluatorKind");
        }

        const validStatuses = [
            "evaluating",
            "feedback_available",
            "evaluation_failed"
        ];

        if (!validStatuses.includes(status)) {
            throw new Error(
                `Invalid evaluation status: ${status}`
            );
        }

        this._id = id.trim();
        this._attemptId = attemptId.trim();
        this._submissionId = submissionId.trim();
        this._evaluatorKind = evaluatorKind.trim();
        this._status = status;
        this._feedback = feedback;
        this._failure = failure;

        Object.freeze(this);
    }

    getId() {
        return this._id;
    }

    getAttemptId() {
        return this._attemptId;
    }

    getSubmissionId() {
        return this._submissionId;
    }

    getEvaluatorKind() {
        return this._evaluatorKind;
    }

    getStatus() {
        return this._status;
    }

    getFeedback() {
        return this._feedback;
    }

    getFailure() {
        return this._failure;
    }

    /**
     * Returns true when the evaluation can be retried.
     *
     * Only a failed evaluation can transition back to evaluating.
     */
    canRetry() {
        return this._status === "evaluation_failed";
    }

    /**
     * Marks a failed evaluation as being evaluated again.
     */
    retry() {
        if (!this.canRetry()) {
            throw new Error(
                "Only a failed evaluation can be retried"
            );
        }

        return new Evaluation({
            id: this._id,
            attemptId: this._attemptId,
            submissionId: this._submissionId,
            evaluatorKind: this._evaluatorKind,
            status: "evaluating"
        });
    }

    /**
     * Creates a successful evaluation result.
     */
    complete(feedback) {
        if (this._status !== "evaluating") {
            throw new Error(
                "Only an evaluating evaluation can be completed"
            );
        }

        if (!feedback) {
            throw new Error(
                "Evaluation requires feedback when completed"
            );
        }

        return new Evaluation({
            id: this._id,
            attemptId: this._attemptId,
            submissionId: this._submissionId,
            evaluatorKind: this._evaluatorKind,
            status: "feedback_available",
            feedback
        });
    }

    /**
     * Creates a failed evaluation result.
     */
    fail(failure) {
        if (this._status !== "evaluating") {
            throw new Error(
                "Only an evaluating evaluation can fail"
            );
        }

        if (!failure) {
            throw new Error(
                "Evaluation requires failure details"
            );
        }

        return new Evaluation({
            id: this._id,
            attemptId: this._attemptId,
            submissionId: this._submissionId,
            evaluatorKind: this._evaluatorKind,
            status: "evaluation_failed",
            failure
        });
    }

    toJSON() {
        return {
            id: this._id,
            attemptId: this._attemptId,
            submissionId: this._submissionId,
            evaluatorKind: this._evaluatorKind,
            status: this._status,
            feedback: this._feedback,
            failure: this._failure
        };
    }
}

module.exports = Evaluation;