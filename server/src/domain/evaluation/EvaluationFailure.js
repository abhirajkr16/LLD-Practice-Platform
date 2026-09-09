/**
 * Represents why an evaluation could not produce a usable result.
 *
 * EvaluationFailure contains diagnostic information about the failed
 * evaluation. It does not decide whether an evaluation should be retried.
 * That lifecycle decision belongs to Evaluation.
 */
class EvaluationFailure {
    /**
     * Creates a new EvaluationFailure.
     *
     * @param {Object} params
     * @param {string} params.code - Stable failure code
     * @param {string} params.message - Human-readable failure description
     * @param {string|null} params.details - Optional diagnostic details
     * @param {Date} params.failedAt - Time when the evaluation failed
     */
    constructor({
        code,
        message,
        details = null,
        failedAt = new Date()
    }) {
        if (typeof code !== "string" || code.trim().length === 0) {
            throw new Error("EvaluationFailure requires a non-empty code");
        }

        if (
            typeof message !== "string" ||
            message.trim().length === 0
        ) {
            throw new Error(
                "EvaluationFailure requires a non-empty message"
            );
        }

        if (
            details !== null &&
            typeof details !== "string"
        ) {
            throw new Error(
                "EvaluationFailure details must be a string or null"
            );
        }

        if (
            !(failedAt instanceof Date) ||
            Number.isNaN(failedAt.getTime())
        ) {
            throw new Error(
                "EvaluationFailure requires a valid failedAt date"
            );
        }

        this._code = code.trim();
        this._message = message.trim();
        this._details = details === null ? null : details.trim();
        this._failedAt = new Date(failedAt.getTime());

        Object.freeze(this);
    }

    getCode() {
        return this._code;
    }

    getMessage() {
        return this._message;
    }

    getDetails() {
        return this._details;
    }

    getFailedAt() {
        return new Date(this._failedAt.getTime());
    }

    toJSON() {
        return {
            code: this._code,
            message: this._message,
            details: this._details,
            failedAt: this._failedAt.toISOString()
        };
    }
}

module.exports = EvaluationFailure;