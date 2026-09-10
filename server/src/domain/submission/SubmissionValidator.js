class SubmissionValidator {
  validate(designEvidence) {
    const errors = [];

    if (designEvidence.getEntities().length === 0) {
      errors.push("At least one entity is required.");
    }

    if (designEvidence.getResponsibilities().length === 0) {
      errors.push("At least one responsibility is required.");
    }

    if (designEvidence.getBehaviors().length === 0) {
      errors.push("At least one behavior is required.");
    }

    if (designEvidence.getRelationships().length === 0) {
      errors.push("At least one relationship is required.");
    }

    if (errors.length > 0) {
      const error = new Error("Submission is incomplete.");
      error.code = "INVALID_REQUEST";
      error.details = errors;

      throw error;
    }
  }
}

module.exports = SubmissionValidator;
