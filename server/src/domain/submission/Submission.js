/**
 * Represents an immutable submission made for an LLD practice attempt.
 *
 * A Submission captures the learner's design at the time of submission.
 * Once created, the submission cannot be changed.
 *
 * Submission owns the DesignEvidence used by the evaluation process.
 * It does not perform evaluation or manage evaluation state.
 */

const DesignEvidence = require("./DesignEvidence");
class Submission {
    /**
     * Creates a new Submission.
     *
     * @param {Object} params
     * @param {string} params.id - Unique submission identifier
     * @param {string} params.attemptId - ID of the attempt this belongs to
     * @param {Object} params.designEvidence - Normalized learner design
     * @param {Date} params.createdAt - Time when the submission was created
     */
    constructor({
        id,
        attemptId,
        designEvidence,
        createdAt = new Date()
    }) {
        if (typeof id !== "string" || id.trim().length === 0) {
            throw new Error("Submission requires a non-empty id");
        }

        if (
            typeof attemptId !== "string" ||
            attemptId.trim().length === 0
        ) {
            throw new Error("Submission requires a non-empty attemptId");
        }

        if (
            !designEvidence ||
            typeof designEvidence !== "object" ||
            Array.isArray(designEvidence)
        ) {
            throw new Error("Submission requires valid designEvidence");
        }

        if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
            throw new Error("Submission requires a valid createdAt date");
        }
        if (!(designEvidence instanceof DesignEvidence)) {
            throw new Error(
                "Submission requires a DesignEvidence instance"
            );
        }

        this._id = id.trim();
        this._attemptId = attemptId.trim();
        this._designEvidence = designEvidence;
        this._createdAt = new Date(createdAt.getTime());

        Object.freeze(this);
    }

    getId() {
        return this._id;
    }

    getAttemptId() {
        return this._attemptId;
    }

    getDesignEvidence() {
        return this._designEvidence;
    }

    getCreatedAt() {
        return new Date(this._createdAt.getTime());
    }

    toJSON() {
        return {
            id: this._id,
            attemptId: this._attemptId,
            designEvidence: this._designEvidence.toJSON(),
            createdAt: this._createdAt.toISOString()
        };
    }
}

module.exports = Submission;