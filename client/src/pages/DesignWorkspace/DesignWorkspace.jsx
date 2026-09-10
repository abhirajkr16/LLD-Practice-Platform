import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProblem, submitDesign } from "../../api/api";
import "./DesignWorkspace.css";

function DesignWorkspace() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function convertToArray(value) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      /*
       * IMPORTANT:
       * This structure must match the backend evaluator contract.
       */
      const designEvidence = {
        entities: convertToArray(form.entities),

        responsibilities: convertToArray(form.responsibilities),

        relationships: convertToArray(form.relationships),

        behaviors: convertToArray(form.behaviors),

        designDecisions: convertToArray(form.designDecisions),

        interfaces: convertToArray(form.interfaces),

        assumptions: convertToArray(form.assumptions),
      };

      console.log("Submitting design evidence:", designEvidence);

      const result = await submitDesign(problemId, designEvidence);

      console.log("Submission result:", result);

      /*
       * Backend response:
       *
       * {
       *   attempt: {
       *      id: "..."
       *   },
       *   submission: {...},
       *   evaluation: {...}
       * }
       *
       * Therefore we need result.attempt.id
       */
      if (result?.attempt?.id) {
        navigate(`/attempts/${result.attempt.id}`);
        return;
      }

      setError("Submission succeeded, but no attempt ID was returned.");
    } catch (err) {
      console.error("Design submission failed:", err);

      setError(
        err.message || "Unable to submit design. Please try again."
      );
    } finally {
      setSubmitting(false);
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

  if (error && !problem) {
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
      <section className="design-workspace">

        {/* Back navigation */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(`/problems/${problemId}`)}
        >
          ← Back to problem
        </button>

        {/* Header */}
        <header className="workspace-header">
          <div className="workspace-header-main">

            <div className="card-top">
              <span className="difficulty">
                {problem.difficulty}
              </span>

              <span className="problem-id">
                {problem.id}
              </span>
            </div>

            <h1>{problem.title}</h1>

            <p>{problem.statement}</p>
          </div>
        </header>

        {/* Design form */}
        <form onSubmit={handleSubmit}>

          <section className="design-section">

            <div className="section-heading">
              <div>
                <p className="eyebrow">LLD Interview</p>

                <h2>Your Design</h2>

                <p>
                  Explain your object-oriented design as if you were
                  answering this problem in an LLD interview.
                </p>
              </div>
            </div>

            {/* Entities */}
            <div className="form-field">
              <label htmlFor="entities">
                Entities / Classes
              </label>

              <p className="field-help">
                List the important classes or entities. Put one entity
                per line.
              </p>

              <textarea
                id="entities"
                name="entities"
                value={form.entities}
                onChange={handleChange}
                placeholder={`Example:

ParkingLot
ParkingFloor
ParkingSpot
Vehicle
ParkingTicket`}
                rows={8}
                required
              />
            </div>

            {/* Responsibilities */}
            <div className="form-field">
              <label htmlFor="responsibilities">
                Responsibilities
              </label>

              <p className="field-help">
                Explain what each important class is responsible for.
                Put one responsibility per line.
              </p>

              <textarea
                id="responsibilities"
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                placeholder={`Example:

ParkingLot manages parking floors
ParkingFloor manages parking spots
ParkingSpot tracks occupancy
Vehicle represents the parked vehicle
ParkingTicket tracks entry and exit time`}
                rows={9}
                required
              />
            </div>

            {/* Relationships */}
            <div className="form-field">
              <label htmlFor="relationships">
                Relationships
              </label>

              <p className="field-help">
                Explain how your classes are connected.
              </p>

              <textarea
                id="relationships"
                name="relationships"
                value={form.relationships}
                onChange={handleChange}
                placeholder={`Example:

ParkingLot contains ParkingFloor
ParkingFloor contains ParkingSpot
ParkingSpot can hold one Vehicle
ParkingTicket references Vehicle and ParkingSpot`}
                rows={7}
                required
              />
            </div>

            {/* Behaviors */}
            <div className="form-field">
              <label htmlFor="behaviors">
                Behaviors
              </label>

              <p className="field-help">
                List important system operations or behaviors.
              </p>

              <textarea
                id="behaviors"
                name="behaviors"
                value={form.behaviors}
                onChange={handleChange}
                placeholder={`Example:

Park vehicle
Find available parking spot
Allocate parking spot
Remove vehicle
Calculate parking fee`}
                rows={7}
                required
              />
            </div>

            {/* Design Decisions */}
            <div className="form-field">
              <label htmlFor="designDecisions">
                Design Decisions
              </label>

              <p className="field-help">
                Explain why you assigned responsibilities this way.
              </p>

              <textarea
                id="designDecisions"
                name="designDecisions"
                value={form.designDecisions}
                onChange={handleChange}
                placeholder={`Example:

ParkingLot does not directly calculate parking fees
ParkingSpot only manages occupancy
Vehicle does not depend on ParkingLot
Pricing is isolated from parking allocation
Each class has a focused responsibility`}
                rows={8}
                required
              />
            </div>

            {/* Interfaces */}
            <div className="form-field">
              <label htmlFor="interfaces">
                Interfaces / Abstractions
              </label>

              <p className="field-help">
                Mention interfaces or abstractions that make the design
                extensible.
              </p>

              <textarea
                id="interfaces"
                name="interfaces"
                value={form.interfaces}
                onChange={handleChange}
                placeholder={`Example:

PricingStrategy
AllocationStrategy`}
                rows={5}
              />
            </div>

            {/* Assumptions */}
            <div className="form-field">
              <label htmlFor="assumptions">
                Assumptions
              </label>

              <p className="field-help">
                Mention assumptions you made while designing the system.
              </p>

              <textarea
                id="assumptions"
                name="assumptions"
                value={form.assumptions}
                onChange={handleChange}
                placeholder={`Example:

A vehicle can occupy one parking spot at a time
A parking spot can hold only one vehicle
Every vehicle has a unique vehicle number`}
                rows={6}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="submit-area">
              <button
                type="submit"
                className="start-button submit-button"
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Submitting..."
                    : "Submit Design"}
                </span>

                <span>→</span>
              </button>
            </div>

          </section>
        </form>
      </section>
    </main>
  );
}

export default DesignWorkspace;