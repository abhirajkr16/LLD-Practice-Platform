const express = require("express");

const {
  getAttemptHandler,
} = require("../../../controllers/attempt.controller");

const {
  retryEvaluationHandler,
} = require("../../../controllers/evaluation.controller");

const router = express.Router();

router.get("/:attemptId", getAttemptHandler);

router.post("/:attemptId/evaluation/retry", retryEvaluationHandler);

module.exports = router;
