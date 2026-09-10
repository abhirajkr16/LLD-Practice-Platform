const {
  listProblems,
  getProblem,
  getProblemAttempts,
} = require("../application/appContainer");

async function listProblemsHandler(req, res, next) {
  try {
    const result = await listProblems.execute();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getProblemHandler(req, res, next) {
  try {
    const { problemId } = req.params;

    const result = await getProblem.execute({
      problemId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getProblemAttemptsHandler(req, res, next) {
  try {
    const { problemId } = req.params;

    const result = await getProblemAttempts.execute({
      problemId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProblemsHandler,
  getProblemHandler,
  getProblemAttemptsHandler,
};
