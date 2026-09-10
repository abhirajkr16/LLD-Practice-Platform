const express = require("express");

const {
    listProblemsHandler,
    getProblemHandler,
    getProblemAttemptsHandler
} = require("../../../controllers/problem.controller");

const {
    submitDesignHandler
} = require("../../../controllers/submission.controller");


const router = express.Router();


router.get(
    "/",
    listProblemsHandler
);


router.get(
    "/:problemId",
    getProblemHandler
);


router.get(
    "/:problemId/attempts",
    getProblemAttemptsHandler
);


router.post(
    "/:problemId/submissions",
    submitDesignHandler
);


module.exports = router;