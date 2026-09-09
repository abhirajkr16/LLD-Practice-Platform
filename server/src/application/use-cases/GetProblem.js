/**
 * Retrieves a single LLD practice problem by its identifier.
 *
 * The use case is responsible for deciding what happens when the
 * requested problem does not exist.
 */
class GetProblem {
    constructor({ problemRepository }) {
        this._problemRepository = problemRepository;
    }

    async execute({ problemId }) {
        if (
            typeof problemId !== "string" ||
            problemId.trim().length === 0
        ) {
            throw new Error("problemId is required");
        }

        const problem = await this._problemRepository.findById(
            problemId.trim()
        );

        if (!problem) {
            throw new Error("Problem not found");
        }

        return problem.getSpecification();
    }
}

module.exports = GetProblem;