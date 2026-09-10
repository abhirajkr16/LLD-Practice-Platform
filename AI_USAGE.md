

Where AI Was Used

1. Backend Architecture

Used to reason through how to structure the backend into domain, application, infrastructure and API layers, and review implementation details for repositories, use-cases, controllers, routes.

What was suggested: Split the project into a domain, application, infrastructure and API layer while still being a single Node.js application or split the app into more microservices with independent deployments.

Accepted: A modular monolith with clear layering, but no services split.

Why: The assignment explicitly allows for a simple monolithic application, and focuses on implementing the LLD/domain design. Microservices would add complexity without a clear benefit to the learning flow, considering the two-day prototype window.

2. Domain Modeling - Attempt, Submission, Evaluation

What was suggested: Don't model a learner's complete practice cycle as a mutable object; keep the attempt, the submitted snapshot, and the evaluation result, separate.

Accepted: Three distinct domain entities - Attempt, Submission, Evaluation.

Why: They change for different reasons and at different timelines. Submissions should be submitted and become immutable, while evaluations can fail or be retried separately. This also means "Edit & Try Again" create a new attempt (linked via predecessorAttemptId) than mutate an old one.

3. Persistence before Evaluation

What was suggested: Persist the learner's attempt and submission before running the evaluator, and not to evaluate first, then save only on success.

Accepted: A UnitOfWork transaction that commits the Attempt, Submission and an initial Evaluation record (with status: evaluating) atomically, and runs the evaluation logic.

Why: Evaluation can fail independently of the learner's design quality (timeouts, etc). The platform should never lose a learner's submitted design because the evaluator crashed. It also allows for the retry API on evaluation_failed state, without requiring resubmission.

4. Evaluator Boundary

What was suggested: Keep evaluation behind an interface/port rather than directly calling one evaluator implementation from the practice flow.

Accepted: An Evaluator port implemented by the DeterministicEvaluator and DefaultRubricPolicy.

Why: The assignment explicitly asks how the product could support a different evaluation approach (e.g. an LLM-based evaluator) in the future. Keeping an evaluator behind a port means it can be swapped without touching the use-cases or the practice flow.

5. Structured Design Evidence instead of Free Text

What was suggested: Expose structured evidence for evaluation, rather than asking an evaluator an unconstrained question like "is this a good design?"

Accepted: A DesignEvidence value object with explicit sections - entities, responsibilities, relationships, behaviors, design decisions, interfaces and assumptions.

Why: This exposes the learner's reasoning to the evaluation, and allows for feedback to be tied to specific submitted evidence, and a normalized representation of evidence, potentially supporting other submission formats (diagrams) in future without redesigning the evaluation input.

6. Rejecting One-size-fits-all Grading

What was suggested: Avoid a single reference solution or 100-point score as the evaluator's primary mechanism.

Accepted: The evaluator outputs structured, qualitative findings across rubric dimensions (prioritized, secondary, optional), rather than comparing the submission's class names against one canonical "correct" design.

Why: LLD questions have many valid solutions. Punishing a learner for choosing a different, but defensible, abstraction would defeat the point of the platform.

7. Debugging SQLite Persistence

Used to debug SQLite integration issues. Identified that JS Date objects need to be converted to ISO strings when persisting and parsed back to Date objects when reading, as better-sqlite3 does not accept JS Date objects as bind parameters.

Verified: The change was validated against the project's real SQLite integration tests (server/test/infrastructure-test.js, server/test/integration-test.js), not based purely on the AI suggestion.

8. API Development and Testing

Used to review REST API structure and debug API-related issues during development. The APIs were verified with manual testing (Postman) and automated testing (Vitest + Supertest project test suite).

9. Documentation

Used to help organize the README, explain the project structure, and improve the wording of technical documentation, including trimming away unnecessary theory, to ensure the documentation stays focused on the actual implementation, and not generic LLD descriptions.

---

What I Rejected or Didn't Implement

The following AI suggestions were intentionally left out of the MVP, for scope reasons - the assignment is a two-day prototype, and they would add time without materially improving the core learner journey:

Microservices

Kafka or another message broker

Kubernetes

Distributed workers/background job queue

Authentication

A full diagram editor

Code execution sandbox

Production LLM orchestration

Complex analytics

Automatic retry/backoff policies

---

How AI Output Was Reviewed

AI suggestions were never accepted as is, in code. For every meaningful AI-assisted change, the following was done:

Check if the suggested change aligns with the assignment brief.

Verify if the change preserves the existing domain boundaries.

Apply the change to the project.

Run the relevant domain, application, infrastructure, integration or API tests to verify behavior.

Check the resulting API or database behavior manually, if relevant (e.g. with Postman).

Fix or revert the change, if it does not match the project's actual requirements.

Verification specifically included:

Domain unit tests (server/test/domain-test.js)

Application use-case tests (server/test/application-test.js)

Infrastructure/repository tests (server/test/infrastructure-test.js)

SQLite integration test (server/test/integration-test.js)

Full Vitest suite

Manual API testing with Postman

---

What Was Done Manually

I was responsible for making design decisions about:

Project structure and layering

Attempt, Submission and Evaluation separation

What data is represented in a design submission (DesignEvidence)

Rubric dimensions used by the MVP evaluator

Retry behavior for failed evaluations

Which AI suggestions were appropriate for the assignment, and which are out of scope.

---

Limitations of AI Assistance

AI suggestions sometimes required correction. For example, some initial implementation would cause incorrect data types to be persisted into SQLite, or make incorrect assumptions about domain object serialization/deserialization. This was done through testing, not trust - to reinforce that generated code should be verified, not blindly assumed to be correct.

---

Conclusion

AI was used as a development and reasoning assistant, not as a replacement for implementation, testing and engineering decisions. The final implementation was reviewed, and modified where necessary, before being submitted as part of the assignment.