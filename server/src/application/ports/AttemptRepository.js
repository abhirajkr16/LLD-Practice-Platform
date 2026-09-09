/**
 * Defines the operations required by the application layer
 * to retrieve and store attempts.
 */
class AttemptRepository {
    async findByProblemId() {
        throw new Error(
            "AttemptRepository.findByProblemId() is not implemented"
        );
    }

    async findById() {
        throw new Error(
            "AttemptRepository.findById() is not implemented"
        );
    }

    async save() {
        throw new Error(
            "AttemptRepository.save() is not implemented"
        );
    }
}

module.exports = AttemptRepository;