# AI Usage

## Purpose

AI tools were used as development assistants during the project for architecture exploration, implementation support, debugging, and review.
The final architecture, feature scope, and implementation decisions were reviewed against the assignment requirements and tested in the working application. AI suggestions were treated as inputs, not as final decisions.

## 1. Deterministic Evaluation Instead of an LLM-Only Evaluator

### Problem

The platform needs to evaluate learner LLD submissions and return useful, repeatable feedback.

### AI-assisted consideration

An AI-based evaluator was considered because an LLM can understand free-form design explanations and generate qualitative feedback.

### Decision

For the MVP, I used a deterministic evaluator based on a defined set of evaluation dimensions.

### Why

- Results are reproducible.
- The evaluator is easier to test.
- Feedback can be traced to submitted evidence.
- There is no external AI API dependency or API cost.
- Failures are easier to reproduce and debug.

### Final implementation

The evaluator checks the submitted design against dimensions such as:

- Requirement Coverage
- Responsibility Assignment
- Structure and Coupling
- Behavioral Coherence
- Extensibility and Rationale

A future LLM evaluator can be added behind the evaluator boundary without changing the main learner workflow.

## 2. Separating Submission from Evaluation

### Problem

A learner's design should not be lost if evaluation fails.

### AI-assisted consideration

Different ways of connecting submission and evaluation were considered, including treating evaluation as part of the submission operation.

### Decision

I kept submission persistence separate from evaluation.

### Why

The submitted design is valuable even when the evaluator fails. This also makes retry behavior possible without asking the learner to submit the design again.

### Final flow

```text
Submit Design
      ↓
Persist Attempt + Submission
      ↓
Run Evaluation
      ↓
Completed / Failed
```

The submission remains available when evaluation fails.

## 3. Revision Creates a New Attempt

### Problem

A learner may want to improve a design after receiving feedback.

### AI-assisted consideration

Two approaches were considered:

- Update the existing submission.
- Create a new attempt containing the revised design.

### Decision

A revision creates a new attempt.

```text
Attempt 1
   ↓
Attempt 2
   ↓
Attempt 3
```

Each revised attempt can keep a reference to its predecessor.

### Why

This preserves the learner's history and makes it possible to compare how the design changed over time.
It also avoids overwriting the original submission and keeps evaluation results attached to the correct version.

## 4. Structured Text as the MVP Submission Format

### Problem

The platform needs enough design information to evaluate LLD thinking without spending most of the assignment time building a complex submission editor.

### AI-assisted consideration

Possible submission formats included code, diagrams, free-form text, and structured text.

### Decision

The MVP uses structured textual design evidence.
The submission captures:

- Entities
- Responsibilities
- Relationships
- Behaviors
- Design Decisions
- Interfaces
- Assumptions

### Why

This provides enough evidence for the current evaluation dimensions while keeping the implementation focused on the core learner journey.
It also avoids adding unnecessary complexity such as:

- UML/diagram editing
- Diagram parsing
- Code execution
- Sandboxed execution environments

A richer submission format can be introduced later without changing the overall attempt/evaluation model.

## 5. Simple Modular Backend Instead of Distributed Services

### Problem

The project needs clear boundaries between the API, application logic, domain logic, and persistence layer.

### AI-assisted consideration

A more distributed architecture could separate problems, submissions, and evaluation into independent services.

### Decision

I kept the MVP as a modular backend rather than introducing microservices.

```text
React Client
     ↓
Express API
     ↓
Application Use Cases
     ↓
Domain
     ↓
Infrastructure
     ↓
SQLite
```

### Why

The assignment is primarily an LLD/domain-design exercise. A distributed architecture would add operational complexity without improving the core learner experience for this MVP.
The current boundaries still allow the evaluator, persistence layer, or other components to evolve independently.

## AI Tools and Development Assistance

AI assistance was used in areas including:

- Exploring implementation approaches.
- Reviewing frontend and backend structure.
- Debugging API and routing issues.
- Improving error handling and UI states.
- Reviewing edge cases and workflow behavior.
- Generating implementation drafts that were then adapted and tested.

AI-generated code was not treated as automatically correct. Code was reviewed, integrated into the existing project structure, and tested through the application workflow.

## What I Kept Under My Own Review

I specifically reviewed:

- Whether the implementation matched the assignment scope.
- Whether domain responsibilities were placed in the correct layer.
- Whether submission history was preserved.
- Whether evaluation failure could be retried safely.
- Whether revision created a new attempt rather than overwriting history.
- Whether the frontend flow matched the intended learner journey.
- Whether the final project avoided unnecessary infrastructure for the MVP.

## Limitations of AI-Assisted Development

AI suggestions can be technically valid but still be wrong for the project's scope.
For this project, I avoided accepting suggestions simply because they made the architecture more sophisticated. Decisions were evaluated based on:

1. Assignment requirements.
2. MVP scope.
3. Simplicity.
4. Testability.
5. Maintainability.
6. Actual behavior of the running system.

The final implementation is therefore a reviewed and tested result of AI-assisted development, rather than an unmodified AI-generated project.
