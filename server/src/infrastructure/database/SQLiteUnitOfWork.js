class SQLiteUnitOfWork {
  constructor({ db }) {
    this._db = db;
  }

  transaction(work) {
    const transaction = this._db.transaction(work);
    return transaction();
  }
}

module.exports = SQLiteUnitOfWork;
