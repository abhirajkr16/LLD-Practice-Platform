import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import ProblemDetails from "../pages/ProblemDetails/ProblemDetails";
import DesignWorkspace from "../pages/DesignWorkspace/DesignWorkspace";
import AttemptDetails from "../pages/AttemptDetails/AttemptDetails";
import AttemptHistory from "../pages/AttemptHistory/AttemptHistory";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/problems"
        element={<Home />}
      />

      <Route
        path="/problems/:problemId"
        element={<ProblemDetails />}
      />

      <Route
        path="/problems/:problemId/design"
        element={<DesignWorkspace />}
      />

      <Route
        path="/problems/:problemId/attempts"
        element={<AttemptHistory />}
      />

      <Route
        path="/attempts/:attemptId"
        element={<AttemptDetails />}
      />
    </Routes>
  );
}

export default AppRoutes;