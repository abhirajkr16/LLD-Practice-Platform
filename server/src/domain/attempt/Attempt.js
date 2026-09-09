/**
 * Represents one submitted practice attempt for an LLD problem.
 *
 * An Attempt connects a learner's practice cycle to a Problem.
 * It is created only when a submission has passed completeness
 * checks and has been successfully persisted.
 *
 * An Attempt does not own the design itself or perform evaluation.
 * Submission and Evaluation are separate domain objects.
 */
class Attempt {
    /**
     * Creates a new Attempt.
     *
     * @param {Object} params
     * @param {string} params.id - Unique attempt identifier
     * @param {string} params.problemId - ID of the problem being attempted
     * @param {string|null} params.predecessorAttemptId - Previous attempt when using Edit & Try Again
     * @param {Date} params.createdAt - Time when the attempt was created
     */
    constructor({
        id,
        problemId,
        predecessorAttemptId = null,
        createdAt = new Date()
    }) {
        if (typeof id !== "string" || id.trim().length === 0) {
            throw new Error("Attempt requires a non-empty id");
        }

        if (
            typeof problemId !== "string" || problemId.trim().length === 0
        ) {
            throw new Error("Attempt requires a non-empty problemId");
        }

        if (
            predecessorAttemptId !== null &&
            (
                typeof predecessorAttemptId !== "string" ||
                predecessorAttemptId.trim().length === 0
            )
        ) {
            throw new Error(
                "predecessorAttemptId must be a non-empty string or null"
            );
        }

        if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
            throw new Error("Attempt requires a valid createdAt date");
        }

        this._id = id.trim();
        this._problemId = problemId.trim();
        this._predecessorAttemptId = predecessorAttemptId === null ? null : predecessorAttemptId.trim();
        this._createdAt = new Date(createdAt.getTime());

        Object.freeze(this);
    }

    getId() {
        return this._id;
    }

    getProblemId() {
        return this._problemId;
    }

    getPredecessorAttemptId() {
        return this._predecessorAttemptId;
    }

    getCreatedAt() {
        return new Date(this._createdAt.getTime());
    }

    /**
     * Returns whether this attempt was created from a previous attempt.
     *
     * This represents the Edit & Try Again flow. A retry of an evaluation
     * does not create another Attempt.
     */
    hasPredecessor() {
        return this._predecessorAttemptId !== null;
    }

    toJSON() {
        return {
            id: this._id,
            problemId: this._problemId,
            predecessorAttemptId: this._predecessorAttemptId,
            createdAt: this._createdAt.toISOString()
        };
    }
}

module.exports = Attempt;