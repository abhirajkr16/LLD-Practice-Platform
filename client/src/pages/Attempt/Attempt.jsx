import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttempt } from "../../api/api";
import "./Attempt.css";

function Attempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  async function loadAttempt() {
    try {
      setLoading(true);
      setError("");

      const data = await getAttempt(attemptId);

      console.log("Attempt response:", data);

      setAttempt(data);
    } catch (err) {
      console.error("Failed to load attempt:", err);

      setError(
        err.message || "Unable to load evaluation."
      );
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <main className="page-container">
        <div className="state-message error-state">
          <p>{error}</p>

          <button onClick={() => navigate("/problems")}>
            Back to problems
          </button>
        </div>
      </main>
    );
  }

  /*
   * The backend may return:
   *
   * {
   *   attempt: {...},
   *   submission: {...},
   *   evaluation: {...}
   * }
   *
   * or the attempt object itself.
   */

  const attemptData = attempt?.attempt || attempt;

  const evaluation = attempt?.evaluation;

  const feedback = evaluation?.feedback;

  const submission =
    attempt?.submission ||
    attemptData?.submission;

  const designEvidence =
    submission?.designEvidence;

  const dimensionFindings =
    feedback?.dimensionFindings || [];

  const priorityFindings =
    feedback?.priorityFindings || [];

  const secondaryFindings =
    feedback?.secondaryFindings || [];

  return (
    <main className="page-container">
      <section className="attempt-page">

        {/* Back */}
        <button
          className="back-button"
          onClick={() => navigate("/problems")}
        >
          ← Back to problems
        </button>

        {/* Header */}
        <header className="attempt-header">

          <div>
            <p className="eyebrow">
              Evaluation
            </p>

            <h1>
              Design Evaluation
            </h1>

            <p>
              Review the feedback on your LLD design.
            </p>
          </div>

          {evaluation?.status && (
            <span className="evaluation-status">
              {evaluation.status.replaceAll("_", " ")}
            </span>
          )}

        </header>

        {/* Overall Assessment */}
        {feedback?.overallAssessment && (
          <section className="feedback-card overall-card">
            <p className="detail-label">
              Overall Assessment
            </p>

            <h2>
              {feedback.overallAssessment}
            </h2>
          </section>
        )}

        {/* Dimension Findings */}
        {dimensionFindings.length > 0 && (
          <section className="feedback-section">

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Evaluation Breakdown
                </p>

                <h2>
                  Design Dimensions
                </h2>

                <p>
                  Your design was evaluated across the
                  main LLD dimensions.
                </p>
              </div>
            </div>

            <div className="findings-grid">

              {dimensionFindings.map((finding, index) => (
                <article
                  className="finding-card"
                  key={`${finding.dimension}-${index}`}
                >

                  <div className="finding-top">

                    <h3>
                      {formatDimension(finding.dimension)}
                    </h3>

                    <span
                      className={`finding-level ${getLevelClass(
                        finding.level
                      )}`}
                    >
                      {finding.level}
                    </span>

                  </div>

                  {finding.classification && (
                    <span className="classification">
                      Classification {finding.classification}
                    </span>
                  )}

                  <p className="finding-message">
                    {finding.message}
                  </p>

                  {finding.evidence && (
                    <Evidence
                      evidence={finding.evidence}
                    />
                  )}

                </article>
              ))}

            </div>
          </section>
        )}

        {/* Priority Findings */}
        {priorityFindings.length > 0 && (
          <section className="feedback-section">

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Important
                </p>

                <h2>
                  Priority Findings
                </h2>
              </div>
            </div>

            <div className="priority-list">

              {priorityFindings.map((finding, index) => (
                <article
                  className="priority-card"
                  key={index}
                >
                  <h3>
                    {formatDimension(finding.dimension)}
                  </h3>

                  <p>
                    {finding.message}
                  </p>
                </article>
              ))}

            </div>
          </section>
        )}

        {/* Secondary Findings */}
        {secondaryFindings.length > 0 && (
          <section className="feedback-section">

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Additional Feedback
                </p>

                <h2>
                  Secondary Findings
                </h2>
              </div>
            </div>

            <div className="secondary-list">

              {secondaryFindings.map((finding, index) => (
                <article
                  className="secondary-card"
                  key={index}
                >
                  <div>
                    <strong>
                      {formatDimension(finding.dimension)}
                    </strong>

                    <span>
                      {finding.level}
                    </span>
                  </div>

                  <p>
                    {finding.message}
                  </p>
                </article>
              ))}

            </div>
          </section>
        )}

        {/* Submitted Design */}
        {designEvidence && (
          <section className="feedback-section">

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Your Submission
                </p>

                <h2>
                  Design Evidence
                </h2>
              </div>
            </div>

            <div className="submission-card">

              {Object.entries(designEvidence).map(
                ([key, value]) => (
                  <div
                    className="submission-field"
                    key={key}
                  >

                    <h3>
                      {formatDimension(key)}
                    </h3>

                    {Array.isArray(value) ? (
                      <ul>
                        {value.map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{String(value)}</p>
                    )}

                  </div>
                )
              )}

            </div>
          </section>
        )}

        {/* Actions */}
        <div className="attempt-actions">

          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                `/problems/${attemptData?.problemId}/design`
              )
            }
          >
            Revise Design
          </button>

          <button
            className="primary-button"
            onClick={() => navigate("/problems")}
          >
            Practice Another Problem →
          </button>

        </div>

      </section>
    </main>
  );
}

/* =========================================
   Helpers
   ========================================= */

function formatDimension(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (character) =>
      character.toUpperCase()
    );
}

function getLevelClass(level) {
  if (!level) {
    return "";
  }

  return level.toLowerCase().replace(/\s+/g, "-");
}

function Evidence({ evidence }) {
  const entries = Object.entries(evidence);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="evidence">

      <p className="evidence-label">
        Evidence
      </p>

      {entries.map(([key, value]) => (
        <div
          className="evidence-item"
          key={key}
        >
          <strong>
            {formatDimension(key)}
          </strong>

          {Array.isArray(value) ? (
            <ul>
              {value.map((item, index) => (
                <li key={index}>
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
      ))}

    </div>
  );
}

export default Attempt;