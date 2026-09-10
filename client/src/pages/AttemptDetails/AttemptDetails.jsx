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

  /* load attempt start here */

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

  /* retry evaluation start here */

  async function handleRetry() {
    try {
      setRetrying(true);
      setError("");

      const data = await retryEvaluation(attemptId);

      setAttempt(data);
    } catch (err) {
      setError(err.message || "Unable to retry evaluation.");
    } finally {
      setRetrying(false);
    }
  }

  /* loading state start here */

  if (loading) {
    return (
      <main className="page-container">
        <div className="state-message">
          <p>Loading attempt...</p>
        </div>
      </main>
    );
  }

  /* error state start here */

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

  const attemptData =
    attempt.attempt || attempt;

  const submission =
    attempt.submission ||
    attemptData.submission;

  const evaluation =
    attempt.evaluation ||
    attemptData.evaluation;

  const feedback =
    evaluation?.feedback;

  const designEvidence =
    submission?.designEvidence || {};

  /* evaluation status start here */

  const evaluationStatus =
    evaluation?.status || "";

  const evaluationFailed =
    evaluationStatus === "failed" ||
    evaluationStatus === "evaluation_failed";

  const feedbackAvailable =
    evaluationStatus === "feedback_available";

  const hasPredecessor =
    Boolean(attemptData.predecessorAttemptId);

  return (
    <main className="page-container attempt-details-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to problems
      </button>

      <section className="attempt-header">
        <div>
          <p className="eyebrow">
            Attempt Details
          </p>

          <h1>
            {attemptData.id
              ? `Attempt ${attemptData.id.slice(0, 8)}`
              : "Attempt"}
          </h1>

          <p className="attempt-subtitle">
            Review the submitted design and evaluation status.
          </p>
        </div>

        <div className="attempt-meta">
          <span className="status-badge">
            {evaluationStatus || "Submitted"}
          </span>
        </div>
      </section>

      <section className="attempt-card">
        <div className="attempt-info-grid">
          <div className="info-item">
            <span className="detail-label">
              Attempt ID
            </span>

            <span className="detail-value">
              {attemptData.id || "Unavailable"}
            </span>
          </div>

          <div className="info-item">
            <span className="detail-label">
              Problem ID
            </span>

            <span className="detail-value">
              {attemptData.problemId || "Unavailable"}
            </span>
          </div>

          <div className="info-item">
            <span className="detail-label">
              Created
            </span>

            <span className="detail-value">
              {formatDate(attemptData.createdAt)}
            </span>
          </div>

          <div className="info-item">
            <span className="detail-label">
              Revision
            </span>

            <span className="detail-value">
              {hasPredecessor
                ? "Revised attempt"
                : "Original attempt"}
            </span>
          </div>
        </div>
      </section>

      <section className="design-summary">
        <div className="section-heading">
          <div>
            <h2>
              Submitted design
            </h2>

            <p>
              The design evidence submitted for this attempt.
            </p>
          </div>
        </div>

        <EvidenceSection
          title="Entities"
          value={designEvidence.entities}
        />

        <EvidenceSection
          title="Responsibilities"
          value={designEvidence.responsibilities}
        />

        <EvidenceSection
          title="Relationships"
          value={designEvidence.relationships}
        />

        <EvidenceSection
          title="Behaviors"
          value={designEvidence.behaviors}
        />

        <EvidenceSection
          title="Design Decisions"
          value={designEvidence.designDecisions}
        />

        <EvidenceSection
          title="Interfaces"
          value={designEvidence.interfaces}
        />

        <EvidenceSection
          title="Assumptions"
          value={designEvidence.assumptions}
        />
      </section>

      {evaluation && (
        <section className="evaluation-summary">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Evaluation
              </p>

              <h2>
                Evaluation status
              </h2>

              <p>
                Current status of the evaluator for this attempt.
              </p>
            </div>
          </div>

          <div className="evaluation-status-card">
            <span className="status-badge">
              {evaluationStatus || "Unknown"}
            </span>

            <span className="evaluator-type">
              {evaluation.evaluatorKind || "Evaluator"}
            </span>
          </div>

          {feedback?.overallAssessment && (
            <div className="assessment-card">
              <p className="detail-label">
                Overall assessment
              </p>

              <p className="assessment-text">
                {feedback.overallAssessment}
              </p>
            </div>
          )}

          {evaluation.failure && (
            <div className="failure-card">
              <p className="detail-label">
                Evaluation failure
              </p>

              <p>
                {evaluation.failure.message ||
                  "The evaluation could not be completed."}
              </p>
            </div>
          )}
        </section>
      )}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <section className="attempt-actions">
        <button
          className="secondary-button"
          onClick={() => navigate("/")}
        >
          Back to problems
        </button>

        <button
          className="secondary-button"
          onClick={() => navigate("/attempts")}
        >
          Attempt history
        </button>

        {feedbackAvailable && (
          <>
            <button
              className="secondary-button"
              onClick={() =>
                navigate(`/attempts/${attemptId}`)
              }
            >
              View evaluation
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                navigate(`/attempts/${attemptId}/revise`)
              }
            >
              Revise design
            </button>
          </>
        )}

        {evaluationFailed && (
          <button
            className="primary-button"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying
              ? "Retrying..."
              : "Retry evaluation"}

            <span>→</span>
          </button>
        )}
      </section>
    </main>
  );
}

/* evidence section start here */

function EvidenceSection({ title, value }) {
  if (!value || value.length === 0) {
    return null;
  }

  const items = Array.isArray(value)
    ? value
    : [value];

  return (
    <div className="evidence-section">
      <h3>
        {title}
      </h3>

      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* date formatting start here */

function formatDate(value) {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default AttemptDetails;