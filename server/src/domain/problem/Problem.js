/**
 * Represents an LLD practice problem.
 *
 * A Problem contains the interview problem specification that learners
 * will practice against. It does not manage attempts, submissions,
 * evaluations, persistence, or UI concerns.
 *
 * Problems are immutable after creation. For the MVP, problems are
 * seeded into the system rather than created by learners.
 */
class Problem {
    /**
     * Creates a new Problem.
     *
     * Required fields are validated here so that an invalid Problem
     * cannot enter the domain.
     *
     * @param {Object} params
     * @param {string} params.id - Unique problem identifier
     * @param {string} params.title - Problem title
     * @param {string} params.statement - Problem statement shown to the learner
     * @param {string} params.difficulty - One of: easy, medium, hard
     * @param {string[]} params.requirements - Functional requirements
     * @param {string[]} params.constraints - Problem constraints
     * @param {Object} params.scope - In-scope and out-of-scope items
     * @param {string[]} params.edgeCases - Relevant edge cases
     * @param {string} params.intent - What the problem is intended to test
     * @param {string} params.changeScenario - Optional requirement-change scenario
     */
    constructor({
        id,
        title,
        statement,
        difficulty = "medium",
        requirements = [],
        constraints = [],
        scope = {},
        edgeCases = [],
        intent = "",
        changeScenario = ""
    }) {
        if (typeof id !== "string" || id.trim().length === 0) {
            throw new Error("Problem requires a non-empty id");
        }

        if (typeof title !== "string" || title.trim().length === 0) {
            throw new Error("Problem requires a non-empty title");
        }

        if (typeof statement !== "string" || statement.trim().length === 0) {
            throw new Error("Problem requires a non-empty statement");
        }

        const validDifficulties = ["easy", "medium", "hard"];

        if (!validDifficulties.includes(difficulty)) {
            throw new Error(
                `Difficulty must be one of: ${validDifficulties.join(", ")}`
            );
        }

        if (!Array.isArray(requirements)) {
            throw new Error("Problem requirements must be an array");
        }

        if (!Array.isArray(constraints)) {
            throw new Error("Problem constraints must be an array");
        }

        if (!Array.isArray(edgeCases)) {
            throw new Error("Problem edge cases must be an array");
        }

        if (typeof scope !== "object" || scope === null || Array.isArray(scope)) {
            throw new Error("Problem scope must be an object");
        }

        const inScope = scope.inScope || [];
        const outOfScope = scope.outOfScope || [];

        if (!Array.isArray(inScope) || !Array.isArray(outOfScope)) {
            throw new Error("Problem scope values must be arrays");
        }

        this._id = id.trim();
        this._title = title.trim();
        this._statement = statement.trim();
        this._difficulty = difficulty;

        this._requirements = Object.freeze([...requirements]);
        this._constraints = Object.freeze([...constraints]);
        this._edgeCases = Object.freeze([...edgeCases]);

        this._scope = Object.freeze({
            inScope: Object.freeze([...inScope]),
            outOfScope: Object.freeze([...outOfScope])
        });

        this._intent = typeof intent === "string" ? intent.trim() : "";
        this._changeScenario = typeof changeScenario === "string" ? changeScenario.trim() : "";

        Object.freeze(this);
    }

    getId() {
        return this._id;
    }

    getTitle() {
        return this._title;
    }

    getStatement() {
        return this._statement;
    }

    getDifficulty() {
        return this._difficulty;
    }

    getRequirements() {
        return [...this._requirements];
    }

    getConstraints() {
        return [...this._constraints];
    }

    getScope() {
        return {
            inScope: [...this._scope.inScope],
            outOfScope: [...this._scope.outOfScope]
        };
    }

    getEdgeCases() {
        return [...this._edgeCases];
    }

    getIntent() {
        return this._intent;
    }

    getChangeScenario() {
        return this._changeScenario;
    }

    hasChangeScenario() {
        return this._changeScenario.length > 0;
    }

    /**
     * Returns the complete problem specification.
     *
     * This gives the application and evaluation layers a clean,
     * read-only representation of the problem without exposing
     * the entity's internal state.
     */
    getSpecification() {
        return {
            id: this._id,
            title: this._title,
            statement: this._statement,
            difficulty: this._difficulty,
            requirements: this.getRequirements(),
            constraints: this.getConstraints(),
            scope: this.getScope(),
            edgeCases: this.getEdgeCases(),
            intent: this._intent,
            changeScenario: this._changeScenario
        };
    }

    toJSON() {
        return this.getSpecification();
    }




}



module.exports = Problem;