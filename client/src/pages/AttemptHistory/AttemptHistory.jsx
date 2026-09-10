import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProblem, getProblemAttempts } from "../../api/api";
import "./AttemptHistory.css";

function AttemptHistory() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAttempts();
  }, [problemId]);

  async function loadAttempts() {
    try {
      setLoading(true);
      setError("");

      const [problemData, attemptsData] = await Promise.all([
        getProblem(problemId),
        getProblemAttempts(problemId),
      ]);

      setProblem(problemData);

      if (Array.isArray(attemptsData)) {
        setAttempts(attemptsData);
      } else if (Array.isArray(attemptsData?.attempts)) {
        setAttempts(attemptsData.attempts);
      } else {
        setAttempts([]);
      }
    } catch (err) {
      setError(err.message || "Unable to load attempts.");
    } finally {
      setLoading(false);
    }
  }

  function openAttempt(attemptId) {
    navigate(`/attempts/${attemptId}`);
  }

  function startNewAttempt() {
    navigate(`/problems/${problemId}/design`);
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="state-message">
          <p>Loading attempts...</p>
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

  return (
    <main className="page-container">
      <section className="attempt-history">

        {/* attempt history header start here */}
        <header className="history-header">
          <button
            className="back-button"
            onClick={() => navigate(`/problems/${problemId}`)}
          >
            ← Back to problem
          </button>

          <div className="history-heading">
            <div>
              <p className="eyebrow">Practice History</p>

              <h1>Attempts</h1>

              {problem && (
                <p className="history-description">
                  {problem.title}
                </p>
              )}
            </div>

            <button
              className="start-button new-attempt-button"
              onClick={startNewAttempt}
            >
              <span>New attempt</span>
              <span>→</span>
            </button>
          </div>
        </header>

        {/* attempts list start here */}
        {attempts.length === 0 ? (
          <div className="empty-attempts">
            <h2>No attempts yet</h2>

            <p>
              You have not submitted a design for this problem yet.
            </p>

            <button
              className="start-button"
              onClick={startNewAttempt}
            >
              <span>Start designing</span>
              <span>→</span>
            </button>
          </div>
        ) : (
          <section className="attempts-section">
            <div className="section-heading">
              <div>
                <h2>Your attempts</h2>

                <p>
                  Open an attempt to review its evaluation and feedback.
                </p>
              </div>

              <span className="attempt-count">
                {attempts.length}{" "}
                {attempts.length === 1 ? "attempt" : "attempts"}
              </span>
            </div>

            <div className="attempt-list">
              {attempts.map((attempt, index) => (
                <article
                  className="attempt-card"
                  key={attempt.id}
                  onClick={() => openAttempt(attempt.id)}
                >
                  <div className="attempt-card-main">
                    <div className="attempt-number">
                      Attempt {attempts.length - index}
                    </div>

                    <div className="attempt-meta">
                      <span>
                        {formatDate(attempt.createdAt)}
                      </span>

                      {attempt.predecessorAttemptId && (
                        <span className="revision-label">
                          Revision
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="attempt-card-right">
                    <span className="attempt-arrow">
                      →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </section>
    </main>
  );
}

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default AttemptHistory;