const Attempt = require("../../domain/attempt/Attempt");

class SQLiteAttemptRepository {
  constructor({ db }) {
    this._db = db;
  }

  findByProblemId(problemId) {
    const rows = this._db
      .prepare(
        `
                SELECT *
                FROM attempts
                WHERE problem_id = ?
                ORDER BY created_at DESC
            `,
      )
      .all(problemId);

    return rows.map((row) => this._toDomain(row));
  }

  findById(id) {
    const row = this._db
      .prepare(
        `
                SELECT *
                FROM attempts
                WHERE id = ?
            `,
      )
      .get(id);

    if (!row) {
      return null;
    }

    return this._toDomain(row);
  }

  save(attempt) {
    this._db
      .prepare(
        `
                INSERT INTO attempts (
                    id,
                    problem_id,
                    predecessor_attempt_id,
                    created_at
                )
                VALUES (?, ?, ?, ?)
            `,
      )
      .run(
        attempt.getId(),
        attempt.getProblemId(),
        attempt.getPredecessorAttemptId() ?? null,
        attempt.getCreatedAt().toISOString(),
      );

    return attempt;
  }

  _toDomain(row) {
    return new Attempt({
      id: row.id,
      problemId: row.problem_id,
      predecessorAttemptId: row.predecessor_attempt_id,
      createdAt: new Date(row.created_at),
    });
  }
}

module.exports = SQLiteAttemptRepository;
