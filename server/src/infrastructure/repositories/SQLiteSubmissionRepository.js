const Submission = require("../../domain/submission/Submission");
const DesignEvidence = require("../../domain/submission/DesignEvidence");

class SQLiteSubmissionRepository {
  constructor({ db }) {
    this._db = db;
  }

  findByAttemptId(attemptId) {
    const row = this._db
      .prepare(
        `
                SELECT *
                FROM submissions
                WHERE attempt_id = ?
            `,
      )
      .get(attemptId);

    if (!row) {
      return null;
    }

    return this._toDomain(row);
  }

  save(submission) {
    this._db
      .prepare(
        `
                INSERT INTO submissions (
                    id,
                    attempt_id,
                    design_evidence,
                    created_at
                )
                VALUES (?, ?, ?, ?)
            `,
      )
      .run(
        submission.getId(),
        submission.getAttemptId(),
        JSON.stringify(submission.getDesignEvidence().toJSON()),
        submission.getCreatedAt().toISOString(),
      );

    return submission;
  }

  _toDomain(row) {
    const designEvidence = new DesignEvidence(JSON.parse(row.design_evidence));

    return new Submission({
      id: row.id,
      attemptId: row.attempt_id,
      designEvidence,
      createdAt: new Date(row.created_at),
    });
  }
}

module.exports = SQLiteSubmissionRepository;
