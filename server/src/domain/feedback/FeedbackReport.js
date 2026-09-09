/**
 * Represents the qualitative feedback produced by an evaluation.
 *
 * A FeedbackReport contains the evaluator's findings across the defined
 * rubric dimensions. It describes the strengths, issues, and evidence
 * found in the learner's design.
 *
 * The report does not calculate a numeric score or contain evaluator logic.
 */
class FeedbackReport {
    /**
     * Creates a new FeedbackReport.
     *
     * @param {Object} params
     * @param {string} params.overallAssessment - Overall qualitative assessment
     * @param {Object[]} params.dimensionFindings - Findings for each rubric dimension
     * @param {Object[]} params.priorityFindings - Highest-priority improvements
     * @param {Object[]} params.secondaryFindings - Secondary improvements
     * @param {Object[]} params.optionalFindings - Optional improvements
     */
    constructor({
        overallAssessment,
        dimensionFindings = [],
        priorityFindings = [],
        secondaryFindings = [],
        optionalFindings = []
    }) {
        if (
            typeof overallAssessment !== "string" ||
            overallAssessment.trim().length === 0
        ) {
            throw new Error(
                "FeedbackReport requires an overallAssessment"
            );
        }

        const collections = {
            dimensionFindings,
            priorityFindings,
            secondaryFindings,
            optionalFindings
        };

        for (const [name, value] of Object.entries(collections)) {
            if (!Array.isArray(value)) {
                throw new Error(
                    `FeedbackReport ${name} must be an array`
                );
            }
        }

        this._overallAssessment = overallAssessment.trim();
        this._dimensionFindings = Object.freeze([
            ...dimensionFindings
        ]);
        this._priorityFindings = Object.freeze([
            ...priorityFindings
        ]);
        this._secondaryFindings = Object.freeze([
            ...secondaryFindings
        ]);
        this._optionalFindings = Object.freeze([
            ...optionalFindings
        ]);

        Object.freeze(this);
    }

    getOverallAssessment() {
        return this._overallAssessment;
    }

    getDimensionFindings() {
        return [...this._dimensionFindings];
    }

    getPriorityFindings() {
        return [...this._priorityFindings];
    }

    getSecondaryFindings() {
        return [...this._secondaryFindings];
    }

    getOptionalFindings() {
        return [...this._optionalFindings];
    }

    toJSON() {
        return {
            overallAssessment: this._overallAssessment,
            dimensionFindings: this.getDimensionFindings(),
            priorityFindings: this.getPriorityFindings(),
            secondaryFindings: this.getSecondaryFindings(),
            optionalFindings: this.getOptionalFindings()
        };
    }
}

module.exports = FeedbackReport;