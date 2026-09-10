const Evaluation = require("../../domain/evaluation/Evaluation");
const FeedbackReport = require("../../domain/feedback/FeedbackReport");
const EvaluationFailure = require("../../domain/evaluation/EvaluationFailure");

class SQLiteEvaluationRepository {
  constructor({ db }) {
    this._db = db;
  }

  findByAttemptId(attemptId) {
    const row = this._db
      .prepare(
        `
                SELECT *
                FROM evaluations
                WHERE attempt_id = ?
            `,
      )
      .get(attemptId);

    if (!row) {
      return null;
    }

    return this._toDomain(row);
  }

  save(evaluation) {
    const data = evaluation.toJSON();

    this._db
      .prepare(
        `
                INSERT INTO evaluations (
                    id,
                    attempt_id,
                    submission_id,
                    evaluator_kind,
                    status,
                    feedback,
                    failure
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    status = excluded.status,
                    feedback = excluded.feedback,
                    failure = excluded.failure
            `,
      )
      .run(
        data.id,
        data.attemptId,
        data.submissionId,
        data.evaluatorKind,
        data.status,
        data.feedback ? JSON.stringify(data.feedback) : null,
        data.failure ? JSON.stringify(data.failure) : null,
      );

    return evaluation;
  }

  _toDomain(row) {
    const feedback = row.feedback
      ? new FeedbackReport(JSON.parse(row.feedback))
      : null;

    const failure = row.failure
      ? new EvaluationFailure(JSON.parse(row.failure))
      : null;

    return new Evaluation({
      id: row.id,
      attemptId: row.attempt_id,
      submissionId: row.submission_id,
      evaluatorKind: row.evaluator_kind,
      status: row.status,
      feedback,
      failure,
    });
  }
}

module.exports = SQLiteEvaluationRepository;
