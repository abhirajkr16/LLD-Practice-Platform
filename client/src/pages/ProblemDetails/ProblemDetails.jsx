import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProblem } from "../../api/api";
import "./ProblemDetails.css";

function ProblemDetails() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  async function loadProblem() {
    try {
      setLoading(true);
      setError("");

      const data = await getProblem(problemId);
      setProblem(data);
    } catch (err) {
      setError(err.message || "Unable to load problem.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="state-message">
          <p>Loading problem...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="state-message error-state">
          <p>{error}</p>

          <button onClick={loadProblem}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!problem) {
    return null;
  }

  return (
    <main className="page-container">
      <section className="problem-details">

        {/* Back */}
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to problems
        </button>

        {/* Header */}
        <header className="details-header">

          <div className="details-meta">
            <span className="difficulty">
              {problem.difficulty}
            </span>

            <span className="problem-id">
              {problem.id}
            </span>
          </div>

          <h1>{problem.title}</h1>

          <p className="details-statement">
            {problem.statement}
          </p>

        </header>

        {/* Requirements + Constraints */}
        <div className="details-grid">

          <section className="detail-section">
            <h2>Requirements</h2>

            <ul>
              {problem.requirements?.map((requirement) => (
                <li key={requirement}>
                  {requirement}
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h2>Constraints</h2>

            <ul>
              {problem.constraints?.map((constraint) => (
                <li key={constraint}>
                  {constraint}
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* Scope */}
        {problem.scope && (
          <section className="detail-section scope-section">

            <h2>Scope</h2>

            <div className="scope-grid">

              <div>
                <p className="detail-label">
                  IN SCOPE
                </p>

                <ul>
                  {problem.scope.inScope?.map((item) => (
                    <li key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="detail-label">
                  OUT OF SCOPE
                </p>

                <ul>
                  {problem.scope.outOfScope?.map((item) => (
                    <li key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </section>
        )}

        {/* Behaviors + Design Expectations */}
        <div className="details-grid">

          <section className="detail-section">
            <h2>Behaviors</h2>

            <ul className="behavior-list">
              <li>
                <code>parkVehicle</code>
              </li>

              <li>
                <code>findAvailableSpot</code>
              </li>

              <li>
                <code>allocateSpot</code>
              </li>

              <li>
                <code>releaseSpot</code>
              </li>

              <li>
                <code>calculateFee</code>
              </li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Design Expectations</h2>

            <ul>
              <li>Separate responsibilities</li>
              <li>Avoid tight coupling</li>
              <li>Support new vehicle types</li>
              <li>Allow allocation rules to change</li>
            </ul>
          </section>

        </div>

        {/* Change Scenario */}
        {problem.changeScenario && (
          <section className="change-scenario">

            <p className="detail-label">
              CHANGE SCENARIO
            </p>

            <p>
              {problem.changeScenario}
            </p>

          </section>
        )}

        {/* Edge Cases */}
        {problem.edgeCases?.length > 0 && (
          <section className="detail-section edge-cases">

            <h2>Edge Cases</h2>

            <ul>
              {problem.edgeCases.map((edgeCase) => (
                <li key={edgeCase}>
                  {edgeCase}
                </li>
              ))}
            </ul>

          </section>
        )}

        {/* Start */}
        <div className="details-actions">
          <button
            className="start-button"
            onClick={() =>
              navigate(`/problems/${problem.id}/design`)
            }
          >
            <span>Start designing</span>
            <span>→</span>
          </button>
        </div>

      </section>
    </main>
  );
}

export default ProblemDetails;