import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAttempt, retryEvaluation } from "../../api/api";
import "./Evaluation.css";

function Evaluation() {
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
      setError(err.message || "Unable to load evaluation.");
    } finally {
      setLoading(false);
    }
  }

  /* retry evaluation start */
  async function handleRetry() {
    try {
      setRetrying(true);
      setError("");

      const data = await retryEvaluation(attemptId);

      if (data) {
        setAttempt(data);
      } else {
        await loadAttempt();
      }
    } catch (err) {
      setError(
        err.message || "Unable to retry evaluation."
      );
    } finally {
      setRetrying(false);
    }
  }
  /* retry evaluation end */

  /* navigation start */
  function goToProblem() {
    const problemId =
      attempt?.problemId ||
      attempt?.attempt?.problemId;

    if (problemId) {
      navigate(`/problems/${problemId}`);
      return;
    }

    navigate("/");
  }

  function goToAttemptHistory() {
    const problemId =
      attempt?.problemId ||
      attempt?.attempt?.problemId;

    if (problemId) {
      navigate(`/attempts?problemId=${problemId}`);
      return;
    }

    navigate("/attempts");
  }

  function goToRevision() {
    navigate(`/attempts/${attemptId}/revise`);
  }
  /* navigation end */

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

          <button onClick={loadAttempt}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!attempt) {
    return null;
  }

  const evaluation = attempt.evaluation;
  const feedback = evaluation?.feedback;

  const canRetry =
    evaluation?.status === "evaluation_failed";

  return (
    <main className="page-container evaluation-page">

      {/* evaluation navigation start */}
      <button
        className="back-button"
        onClick={goToProblem}
      >
        ← Back to problem
      </button>
      {/* evaluation navigation end */}

      {/* evaluation header start */}
      <section className="evaluation-header">
        <div>
          <p className="eyebrow">
            Design Evaluation
          </p>

          <h1>
            Your design feedback
          </h1>

          <p className="evaluation-subtitle">
            Review how your solution performed across
            the main LLD evaluation dimensions.
          </p>
        </div>

        <div className="evaluation-meta">
          <span className="status-badge">
            {evaluation?.status || "Unknown"}
          </span>

          <span className="evaluator-type">
            {evaluation?.evaluatorKind || "Evaluator"}
          </span>
        </div>
      </section>
      {/* evaluation header end */}

      {/* error message start */}
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
      {/* error message end */}

      {/* overall assessment start */}
      {feedback?.overallAssessment && (
        <section className="assessment-card">
          <p className="detail-label">
            Overall assessment
          </p>

          <p className="assessment-text">
            {feedback.overallAssessment}
          </p>
        </section>
      )}
      {/* overall assessment end */}

      {/* dimension findings start */}
      {feedback?.dimensionFindings?.length > 0 && (
        <section className="feedback-section">
          <div className="section-heading">
            <div>
              <h2>Evaluation dimensions</h2>

              <p>
                Feedback across the key areas of your design.
              </p>
            </div>
          </div>

          <div className="dimension-list">
            {feedback.dimensionFindings.map((finding) => (
              <article
                className="dimension-card"
                key={finding.dimension}
              >
                <div className="dimension-top">
                  <div>
                    <p className="dimension-name">
                      {formatDimension(
                        finding.dimension
                      )}
                    </p>

                    <span className="dimension-level">
                      {finding.level}
                    </span>
                  </div>

                  <span className="classification">
                    {finding.classification}
                  </span>
                </div>

                <p className="dimension-message">
                  {finding.message}
                </p>

                {finding.evidence && (
                  <div className="evidence">
                    <p className="evidence-title">
                      Evidence
                    </p>

                    <EvidenceContent
                      evidence={finding.evidence}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {/* dimension findings end */}

      {/* priority findings start */}
      {feedback?.priorityFindings?.length > 0 && (
        <FeedbackGroup
          title="Priority findings"
          description="Areas that deserve attention first."
          findings={feedback.priorityFindings}
          variant="priority"
        />
      )}
      {/* priority findings end */}

      {/* secondary findings start */}
      {feedback?.secondaryFindings?.length > 0 && (
        <FeedbackGroup
          title="Secondary findings"
          description="Additional areas where your design can improve."
          findings={feedback.secondaryFindings}
        />
      )}
      {/* secondary findings end */}

      {/* optional findings start */}
      {feedback?.optionalFindings?.length > 0 && (
        <FeedbackGroup
          title="Optional findings"
          description="Additional observations from the evaluator."
          findings={feedback.optionalFindings}
        />
      )}
      {/* optional findings end */}

      {/* evaluation failure start */}
      {evaluation?.failure && (
        <section className="failure-card">
          <p className="detail-label">
            Evaluation failure
          </p>

          <p>
            {evaluation.failure.message ||
              "The evaluation could not be completed."}
          </p>
        </section>
      )}
      {/* evaluation failure end */}

      {/* evaluation actions start */}
      <section className="evaluation-actions">

        <button
          className="secondary-button"
          onClick={goToProblem}
        >
          Back to problem
        </button>

        <button
          className="secondary-button"
          onClick={goToAttemptHistory}
        >
          Attempt history
        </button>

        <button
          className="secondary-button"
          onClick={goToRevision}
        >
          Revise design
        </button>

        {canRetry && (
          <button
            className="primary-button"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying
              ? "Retrying..."
              : "Retry evaluation"}

            {!retrying && <span>→</span>}
          </button>
        )}

      </section>
      {/* evaluation actions end */}

    </main>
  );
}

function formatDimension(value) {
  if (!value) return "";

  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function EvidenceContent({ evidence }) {
  return (
    <div className="evidence-content">
      {Object.entries(evidence).map(([key, value]) => (
        <div
          className="evidence-item"
          key={key}
        >
          <span className="evidence-key">
            {formatDimension(key)}
          </span>

          {Array.isArray(value) ? (
            <ul>
              {value.map((item, index) => (
                <li key={`${key}-${index}`}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <span className="evidence-value">
              {String(value)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function FeedbackGroup({
  title,
  description,
  findings,
  variant = "",
}) {
  return (
    <section
      className={`feedback-section ${variant}`}
    >
      <div className="section-heading">
        <div>
          <h2>{title}</h2>

          <p>{description}</p>
        </div>
      </div>

      <div className="finding-list">
        {findings.map((finding, index) => (
          <article
            className="finding-card"
            key={`${finding.dimension}-${index}`}
          >
            <div className="finding-top">
              <span className="finding-dimension">
                {formatDimension(finding.dimension)}
              </span>

              <span className="finding-level">
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
  );
}

export default Evaluation;