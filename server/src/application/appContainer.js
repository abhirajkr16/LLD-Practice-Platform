const crypto = require("crypto");
const db = require("../database/connection");

const SQLiteProblemRepository = require("../infrastructure/repositories/SQLiteProblemRepository");
const SQLiteAttemptRepository = require("../infrastructure/repositories/SQLiteAttemptRepository");
const SQLiteSubmissionRepository = require("../infrastructure/repositories/SQLiteSubmissionRepository");
const SQLiteEvaluationRepository = require("../infrastructure/repositories/SQLiteEvaluationRepository");

const SQLiteUnitOfWork = require("../infrastructure/database/SQLiteUnitOfWork");

const ListProblems = require("./use-cases/ListProblems");
const GetProblem = require("./use-cases/GetProblem");
const GetProblemAttempts = require("./use-cases/GetProblemAttempts");
const SubmitDesign = require("./use-cases/SubmitDesign");
const GetAttempt = require("./use-cases/GetAttempt");
const RetryEvaluation = require("./use-cases/RetryEvaluation");

const problemRepository = new SQLiteProblemRepository({
  db,
});

const attemptRepository = new SQLiteAttemptRepository({
  db,
});

const submissionRepository = new SQLiteSubmissionRepository({
  db,
});

const evaluationRepository = new SQLiteEvaluationRepository({
  db,
});

const unitOfWork = new SQLiteUnitOfWork({
  db,
});

const listProblems = new ListProblems({
  problemRepository,
});

const getProblem = new GetProblem({
  problemRepository,
});

const getProblemAttempts = new GetProblemAttempts({
  problemRepository,
  attemptRepository,
});

const submitDesign = new SubmitDesign({
  problemRepository,
  attemptRepository,
  submissionRepository,
  evaluationRepository,
  idGenerator: { generate: (prefix) => `${prefix}-${crypto.randomUUID()}` },
  unitOfWork,
});

const getAttempt = new GetAttempt({
  attemptRepository,
  submissionRepository,
  evaluationRepository,
});

const retryEvaluation = new RetryEvaluation({
  attemptRepository,
  submissionRepository,
  evaluationRepository,
});

module.exports = {
  listProblems,
  getProblem,
  getProblemAttempts,
  submitDesign,
  getAttempt,
  retryEvaluation,
};
