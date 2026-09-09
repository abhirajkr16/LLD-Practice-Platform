/**
 * Defines the operations required by the application layer
 * to retrieve and store submissions.
 */
class SubmissionRepository {
    async findByAttemptId() {
        throw new Error(
            "SubmissionRepository.findByAttemptId() is not implemented"
        );
    }

    async save() {
        throw new Error(
            "SubmissionRepository.save() is not implemented"
        );
    }
}

module.exports = SubmissionRepository;