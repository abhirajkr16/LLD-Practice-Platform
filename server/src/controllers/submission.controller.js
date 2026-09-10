const { submitDesign } = require("../application/appContainer");

async function submitDesignHandler(req, res, next) {
  try {
    const { problemId } = req.params;

    const { designEvidence, predecessorAttemptId } = req.body;

    const result = await submitDesign.execute({
      problemId,
      designEvidence,
      predecessorAttemptId,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitDesignHandler,
};
