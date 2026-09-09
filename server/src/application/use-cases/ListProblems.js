/**
 * Lists all available LLD practice problems.
 *
 * The use case coordinates the request and delegates problem retrieval
 * to the problem repository. It does not know how problems are stored.
 */
class ListProblems {
    constructor({ problemRepository }) {
        this._problemRepository = problemRepository;
    }

    async execute() {
        const problems = await this._problemRepository.findAll();

        return problems.map(problem => problem.getSpecification());
    }
}

module.exports = ListProblems;