/**
 * Retrieves the attempts made for a specific problem.
 *
 * The use case delegates attempt retrieval to the repository
 * and keeps storage details outside the application layer.
 */
class GetProblemAttempts {
    constructor({ attemptRepository, problemRepository }) {
        this._attemptRepository = attemptRepository;
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

        const attempts = await this._attemptRepository.findByProblemId(
            problemId.trim()
        );

        return attempts.map(attempt => attempt.toJSON());
    }
}

module.exports = GetProblemAttempts;