import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProblems } from "../../api/api";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProblems();
  }, []);

  async function loadProblems() {
    try {
      setLoading(true);
      setError("");

      const data = await getProblems();

      setProblems(data);
    } catch (err) {
      setError(err.message || "Unable to load problems.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">LLD</span>
            <span>Practice Platform</span>
          </div>

          <span className="version">MVP</span>
        </div>
      </header>

      <main className="page-container">
        <section className="hero">
          <p className="eyebrow">
            Low-Level Design Practice
          </p>

          <h1>
            Practice LLD like an interview.
          </h1>

          <p className="hero-text">
            Choose a design problem, explain your approach,
            and get structured feedback on your solution.
          </p>
        </section>

        <section className="problems-section">
          <div className="section-heading">
            <div>
              <h2>Problems</h2>

              <p>
                Choose a problem to start practicing.
              </p>
            </div>

            {!loading && !error && (
              <span className="problem-count">
                {problems.length}{" "}
                {problems.length === 1
                  ? "problem"
                  : "problems"}
              </span>
            )}
          </div>

          {loading && (
            <div className="state-message">
              <p>Loading problems...</p>
            </div>
          )}

          {error && (
            <div className="state-message error-state">
              <p>{error}</p>

              <button onClick={loadProblems}>
                Try again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            problems.length === 0 && (
              <div className="state-message">
                <p>No problems available.</p>
              </div>
            )}

          {!loading &&
            !error &&
            problems.length > 0 && (
              <div className="problem-grid">
                {problems.map((problem) => (
                  <article
                    className="problem-card"
                    key={problem.id}
                  >
                    <div className="card-top">
                      <span className="difficulty">
                        {problem.difficulty}
                      </span>

                      <span className="problem-id">
                        {problem.id}
                      </span>
                    </div>

                    <h3>{problem.title}</h3>

                    <p className="problem-description">
                      {problem.statement}
                    </p>

                    {problem.requirements?.length > 0 && (
                      <div className="requirements">
                        <p className="requirements-title">
                          You will work on
                        </p>

                        <ul>
                          {problem.requirements
                            .slice(0, 4)
                            .map((requirement) => (
                              <li key={requirement}>
                                {requirement}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <button
                      className="start-button"
                      onClick={() =>
                        navigate(
                          `/problems/${problem.id}`
                        )
                      }
                    >
                      <span>Start problem</span>
                      <span>→</span>
                    </button>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>
    </>
  );
}

export default Home;