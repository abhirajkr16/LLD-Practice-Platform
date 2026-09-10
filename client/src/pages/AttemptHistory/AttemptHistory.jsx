import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProblemAttempts } from "../../api/api";

import "./AttemptHistory.css";

function AttemptHistory() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttempts();
  }, []);

  async function loadAttempts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProblemAttempts("parking-lot-001");

      const attemptList =
        Array.isArray(data)
          ? data
          : data?.attempts ||
            data?.items ||
            [];

      setAttempts(attemptList);
    } catch (err) {
      setError(err.message || "Unable to load attempt history.");
    } finally {
      setLoading(false);
    }
  }

  function openAttempt(attemptId) {
    navigate(`/attempts/${attemptId}`);
  }

  function openDetails(attemptId) {
    navigate(`/attempts/${attemptId}/details`);
  }

  function openRevision(attemptId) {
    navigate(`/attempts/${attemptId}/revise`);
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="state-message">
          <p>Loading attempt history...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="state-message error-state">
          <p>{error}</p>

          <button onClick={loadAttempts}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container attempt-history-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to problems
      </button>

      <header className="attempt-history-header">
        <p className="eyebrow">
          Practice History
        </p>

        <h1>
          Attempt history
        </h1>

        <p>
          Review your previous LLD design attempts and continue
          improving your solutions.
        </p>
      </header>

      {attempts.length === 0 ? (
        <section className="state-message empty-state">
          <p>
            No attempts found for this problem.
          </p>

          <button
            onClick={() =>
              navigate("/problems/parking-lot-001")
            }
          >
            View problem
          </button>
        </section>
      ) : (
        <section className="attempt-list">
          {attempts.map((attempt, index) => {
            const attemptId =
              attempt.id ||
              attempt.attemptId;

            const evaluation =
              attempt.evaluation;

            const feedback =
              evaluation?.feedback;

            const createdAt =
              attempt.createdAt;

            const status =
              evaluation?.status ||
              attempt.status ||
              "Submitted";

            const assessment =
              feedback?.overallAssessment ||
              "Evaluation feedback is available for this attempt.";

            return (
              <article
                className="attempt-card"
                key={attemptId || index}
              >
                <div className="attempt-card-top">
                  <div>
                    <span className="attempt-number">
                      Attempt {attempts.length - index}
                    </span>

                    <h2>
                      {attemptId
                        ? `Attempt ${attempts.length - index}`
                        : "Design attempt"}
                    </h2>
                  </div>

                  <span className="attempt-status">
                    {status}
                  </span>
                </div>

                {createdAt && (
                  <p className="attempt-date">
                    {formatDate(createdAt)}
                  </p>
                )}

                <p className="attempt-assessment">
                  {assessment}
                </p>

                <div className="attempt-actions">
                  {attemptId && (
                    <>
                      <button
                        className="secondary-button"
                        onClick={() =>
                          openAttempt(attemptId)
                        }
                      >
                        Evaluation
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() =>
                          openDetails(attemptId)
                        }
                      >
                        Details
                      </button>

                      <button
                        className="primary-button"
                        onClick={() =>
                          openRevision(attemptId)
                        }
                      >
                        Revise
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default AttemptHistory;