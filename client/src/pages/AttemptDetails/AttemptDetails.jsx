import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAttempt,
  retryEvaluation,
} from "../../api/api";
import "./AttemptDetails.css";

function AttemptDetails() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  async function loadAttempt() {
    try {
      setLoading(true);
      setError("");

      const data = await getAttempt(attemptId);
      setAttempt(data);
    } catch (err) {
      setError(err.message || "Unable to load attempt.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    try {
      setRetrying(true);
      setError("");

      const result = await retryEvaluation(attemptId);

      setAttempt(result);
    } catch (err) {
      setError(err.message || "Unable to retry evaluation.");
    } finally {
      setRetrying(false);
    }
  }

  function handleBack() {
    navigate("/problems");
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="state-message">
          <p>Loading evaluation...</p>
        </div>
      </main>
    );
  }

  if (error && !attempt) {
    return (
      <main className="page-container">
        <div className="state-message error-state">
          <p>{error}</p>

          <button onClick={handleBack}>
            Back to problems
          </button>
        </div>
      </main>
    );
  }

  const evaluation = attempt?.evaluation;
  const feedback = evaluation?.feedback;

  return (
    <main className="page-container">
      <section className="attempt-details">

        {/* evaluation header start here */}
        <header className="attempt-header">
          <button
            className="back-button"
            onClick={handleBack}
          >
            ← Back to problems
          </button>

          <div className="attempt-heading">
            <div>
              <p className="eyebrow">
                Evaluation
              </p>

              <h1>
                Design Evaluation
              </h1>

              <p className="attempt-id">
                Attempt: {attempt?.id}
              </p>
            </div>

            <span className={`evaluation-status ${evaluation?.status}`}>
              {evaluation?.status || "unknown"}
            </span>
          </div>
        </header>

        {/* evaluation summary start here */}
        {feedback && (
          <section className="evaluation-summary">
            <h2>Overall Assessment</h2>

            <p>
              {feedback.overallAssessment}
            </p>
          </section>
        )}

        {/* dimension findings start here */}
        {feedback?.dimensionFindings?.length > 0 && (
          <section className="findings-section">
            <div className="section-heading">
              <div>
                <h2>Evaluation Feedback</h2>

                <p>
                  Review how your design performed across the main LLD
                  evaluation dimensions.
                </p>
              </div>
            </div>

            <div className="findings-list">
              {feedback.dimensionFindings.map((finding) => (
                <article
                  className="finding-card"
                  key={finding.dimension}
                >
                  <div className="finding-header">
                    <h3>
                      {formatDimension(finding.dimension)}
                    </h3>

                    <span className="finding-level">
                      {finding.level}
                    </span>
                  </div>

                  <p className="finding-message">
                    {finding.message}
                  </p>

                  {finding.evidence && (
                    <div className="finding-evidence">
                      <p className="detail-label">
                        Evidence
                      </p>

                      {Object.entries(finding.evidence).map(
                        ([key, value]) => (
                          <div
                            className="evidence-item"
                            key={key}
                          >
                            <strong>
                              {formatDimension(key)}:
                            </strong>

                            {Array.isArray(value) ? (
                              <ul>
                                {value.map((item) => (
                                  <li key={item}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span>
                                {String(value)}
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* priority findings start here */}
        {feedback?.priorityFindings?.length > 0 && (
          <section className="findings-section">
            <div className="section-heading">
              <div>
                <h2>Priority Findings</h2>

                <p>
                  These are the most important areas to improve.
                </p>
              </div>
            </div>

            <div className="findings-list">
              {feedback.priorityFindings.map((finding, index) => (
                <article
                  className="finding-card priority-card"
                  key={`${finding.dimension}-${index}`}
                >
                  <div className="finding-header">
                    <h3>
                      {formatDimension(finding.dimension)}
                    </h3>

                    <span className="finding-level">
                      {finding.level}
                    </span>
                  </div>

                  <p className="finding-message">
                    {finding.message}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* retry evaluation start here */}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="attempt-actions">
          <button
            className="secondary-button"
            onClick={handleBack}
          >
            Back to problems
          </button>

          <button
            className="start-button"
            onClick={handleRetry}
            disabled={retrying}
          >
            <span>
              {retrying
                ? "Retrying..."
                : "Retry evaluation"}
            </span>

            <span>→</span>
          </button>
        </div>

      </section>
    </main>
  );
}

function formatDimension(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export default AttemptDetails;