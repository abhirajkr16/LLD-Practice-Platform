const { getAttempt } = require("../application/appContainer");

async function getAttemptHandler(req, res, next) {
  try {
    const { attemptId } = req.params;

    const result = await getAttempt.execute({
      attemptId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAttemptHandler,
};
