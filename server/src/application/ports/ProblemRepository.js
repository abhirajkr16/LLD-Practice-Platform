/**
 * Defines the operations required by the application layer
 * to retrieve practice problems.
 *
 * This is a port. Infrastructure provides the implementation.
 */
class ProblemRepository {
    async findAll() {
        throw new Error("ProblemRepository.findAll() is not implemented");
    }

    async findById() {
        throw new Error("ProblemRepository.findById() is not implemented");
    }
}

module.exports = ProblemRepository;