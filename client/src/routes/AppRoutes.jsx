import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import ProblemDetails from "../pages/ProblemDetails/ProblemDetails";
import DesignWorkspace from "../pages/DesignWorkspace/DesignWorkspace";
import Evaluation from "../pages/Evaluation/Evaluation";
import AttemptHistory from "../pages/AttemptHistory/AttemptHistory";
import AttemptDetails from "../pages/AttemptDetails/AttemptDetails";
import ReviseDesign from "../pages/ReviseDesign/ReviseDesign";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/problems/:problemId"
        element={<ProblemDetails />}
      />

      <Route
        path="/problems/:problemId/design"
        element={<DesignWorkspace />}
      />

      <Route
        path="/attempts"
        element={<AttemptHistory />}
      />

      <Route
        path="/attempts/:attemptId"
        element={<Evaluation />}
      />

      <Route
        path="/attempts/:attemptId/details"
        element={<AttemptDetails />}
      />

      <Route
        path="/attempts/:attemptId/revise"
        element={<ReviseDesign />}
      />

      <Route
        path="*"
        element={<Home />}
      />
    </Routes>
  );
}

export default AppRoutes;