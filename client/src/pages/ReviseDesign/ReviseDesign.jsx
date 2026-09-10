import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAttempt,
  submitRevision,
} from "../../api/api";

import "./ReviseDesign.css";

function ReviseDesign() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    entities: "",
    responsibilities: "",
    relationships: "",
    behaviors: "",
    designDecisions: "",
    interfaces: "",
    assumptions: "",
  });

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  /* load previous attempt start here */

  async function loadAttempt() {
    try {
      setLoading(true);
      setError("");

      const data = await getAttempt(attemptId);

      setAttempt(data);

      const evidence =
        data?.submission?.designEvidence ||
        data?.attempt?.submission?.designEvidence ||
        {};

      setForm({
        entities: toText(evidence.entities),
        responsibilities: toText(evidence.responsibilities),
        relationships: toText(evidence.relationships),
        behaviors: toText(evidence.behaviors),
        designDecisions: toText(evidence.designDecisions),
        interfaces: toText(evidence.interfaces),
        assumptions: toText(evidence.assumptions),
      });
    } catch (err) {
      setError(err.message || "Unable to load previous attempt.");
    } finally {
      setLoading(false);
    }
  }

  /* form handling start here */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* revision submission start here */

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const problemId =
        attempt?.attempt?.problemId ||
        attempt?.attempt?.problem_id ||
        attempt?.problemId;

      if (!problemId) {
        throw new Error("Problem information is missing.");
      }

      const designEvidence = {
        entities: toArray(form.entities),
        responsibilities: toArray(form.responsibilities),
        relationships: toArray(form.relationships),
        behaviors: toArray(form.behaviors),
        designDecisions: toArray(form.designDecisions),
        interfaces: toArray(form.interfaces),
        assumptions: toArray(form.assumptions),
      };

      const result = await submitRevision(
        problemId,
        attemptId,
        designEvidence
      );

      const newAttemptId =
        result?.attempt?.id ||
        result?.id;

      if (!newAttemptId) {
        throw new Error(
          "Revision was submitted but no new attempt ID was returned."
        );
      }

      navigate(`/attempts/${newAttemptId}`);
    } catch (err) {
      setError(err.message || "Unable to submit revised design.");
    } finally {
      setSubmitting(false);
    }
  }

  /* loading state start here */

  if (loading) {
    return (
      <main className="page-container">
        <div className="state-message">
          <p>Loading previous attempt...</p>
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

          <button onClick={() => navigate(`/attempts/${attemptId}`)}>
            Back to evaluation
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container revise-page">
      <button
        className="back-button"
        onClick={() => navigate(`/attempts/${attemptId}`)}
      >
        ← Back to evaluation
      </button>

      <section className="revise-header">
        <p className="eyebrow">
          Revise your design
        </p>

        <h1>
          Improve your LLD solution
        </h1>

        <p>
          Review the evaluator feedback, improve the weak areas,
          and submit a new version of your design.
        </p>
      </section>

      <section className="previous-evaluation">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              Previous evaluation
            </p>

            <h2>
              What needs improvement?
            </h2>
          </div>
        </div>

        {attempt?.evaluation?.feedback?.overallAssessment && (
          <p className="previous-assessment">
            {attempt.evaluation.feedback.overallAssessment}
          </p>
        )}

        {attempt?.evaluation?.feedback?.priorityFindings?.length > 0 && (
          <div className="previous-findings">
            <h3>Priority findings</h3>

            {attempt.evaluation.feedback.priorityFindings.map(
              (finding, index) => (
                <article
                  className="previous-finding"
                  key={`${finding.dimension}-${index}`}
                >
                  <div>
                    <strong>
                      {formatDimension(finding.dimension)}
                    </strong>

                    <p>
                      {finding.message}
                    </p>
                  </div>

                  <span>
                    {finding.level}
                  </span>
                </article>
              )
            )}
          </div>
        )}

        {attempt?.evaluation?.feedback?.secondaryFindings?.length > 0 && (
          <div className="previous-findings">
            <h3>Secondary findings</h3>

            {attempt.evaluation.feedback.secondaryFindings.map(
              (finding, index) => (
                <article
                  className="previous-finding"
                  key={`${finding.dimension}-${index}`}
                >
                  <div>
                    <strong>
                      {formatDimension(finding.dimension)}
                    </strong>

                    <p>
                      {finding.message}
                    </p>
                  </div>

                  <span>
                    {finding.level}
                  </span>
                </article>
              )
            )}
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <section className="revise-form">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Revision
              </p>

              <h2>
                Your revised design
              </h2>

              <p>
                Improve your previous answer instead of starting
                completely from scratch.
              </p>
            </div>
          </div>

          <FormField
            label="Entities"
            name="entities"
            value={form.entities}
            onChange={handleChange}
            help="Enter one entity or class per line."
          />

          <FormField
            label="Responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            help="Explain the responsibility of each major entity."
          />

          <FormField
            label="Relationships"
            name="relationships"
            value={form.relationships}
            onChange={handleChange}
            help="Explain how the entities are connected and interact."
          />

          <FormField
            label="Behaviors"
            name="behaviors"
            value={form.behaviors}
            onChange={handleChange}
            help="Describe the important operations and system behavior."
          />

          <FormField
            label="Design Decisions"
            name="designDecisions"
            value={form.designDecisions}
            onChange={handleChange}
            help="Explain why responsibilities and relationships are designed this way."
          />

          <FormField
            label="Interfaces"
            name="interfaces"
            value={form.interfaces}
            onChange={handleChange}
            help="Mention interfaces or abstractions that improve extensibility."
          />

          <FormField
            label="Assumptions"
            name="assumptions"
            value={form.assumptions}
            onChange={handleChange}
            help="State important assumptions made while designing the system."
          />

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="submit-area">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit revised design"}

              <span>→</span>
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

/* reusable form field start here */

function FormField({
  label,
  name,
  value,
  onChange,
  help,
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
      </label>

      <p className="field-help">
        {help}
      </p>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={7}
        required
      />
    </div>
  );
}

/* text conversion start here */

function toText(value) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return String(value);
}

/* array conversion start here */

function toArray(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

/* dimension formatting start here */

function formatDimension(value) {
  if (!value) {
    return "";
  }

  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default ReviseDesign;