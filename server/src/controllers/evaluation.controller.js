const { retryEvaluation } = require("../application/appContainer");

async function retryEvaluationHandler(req, res, next) {
  try {
    const { attemptId } = req.params;

    const result = await retryEvaluation.execute({
      attemptId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  retryEvaluationHandler,
};
