const Problem = require("../../domain/problem/Problem");

class SQLiteProblemRepository {
  constructor({ db }) {
    this._db = db;
  }

   findAll() {
    const rows = this._db.prepare("SELECT * FROM problems ORDER BY id").all();

    return rows.map((row) => this._toDomain(row));
  }

   findById(id) {
    const row = this._db.prepare("SELECT * FROM problems WHERE id = ?").get(id);

    if (!row) {
      return null;
    }

    return this._toDomain(row);
  }

  _toDomain(row) {
    return new Problem({
      id: row.id,
      title: row.title,
      statement: row.statement,
      difficulty: row.difficulty,
      requirements: JSON.parse(row.requirements),
      constraints: JSON.parse(row.constraints),
      scope: JSON.parse(row.scope),
      edgeCases: JSON.parse(row.edge_cases),
      intent: row.intent,
      changeScenario: row.change_scenario,
    });
  }
}

module.exports = SQLiteProblemRepository;
