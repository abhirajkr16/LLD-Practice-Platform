const RubricPolicy = require("../../application/ports/RubricPolicy");

class DefaultRubricPolicy extends RubricPolicy {
  evaluate(problem, designEvidence) {
    const findings = [];

    const requirements = problem.getRequirements();
    const entities = designEvidence.getEntities();
    const responsibilities = designEvidence.getResponsibilities();
    const relationships = designEvidence.getRelationships();
    const behaviors = designEvidence.getBehaviors();
    const designDecisions = designEvidence.getDesignDecisions();

    const evidenceText = [
      ...entities,
      ...responsibilities,
      ...relationships,
      ...behaviors,
      ...designDecisions,
    ]
      .join(" ")
      .toLowerCase();

    const coveredRequirements = [];
    const missingRequirements = [];

    for (const requirement of requirements) {
      const words = requirement
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const covered = words.some((word) => evidenceText.includes(word));

      if (covered) {
        coveredRequirements.push(requirement);
      } else {
        missingRequirements.push(requirement);
      }
    }

    if (missingRequirements.length === 0) {
      findings.push({
        dimension: "requirement_coverage",
        level: "Strong",
        classification: "B",
        message:
          "The submission provides evidence related to all stated requirements.",
        evidence: {
          coveredRequirements,
        },
      });
    } else if (coveredRequirements.length > 0) {
      findings.push({
        dimension: "requirement_coverage",
        level: "Adequate",
        classification: "A",
        message:
          "The design covers some requirements but needs clearer evidence for the missing ones.",
        evidence: {
          coveredRequirements,
          missingRequirements,
        },
      });
    } else {
      findings.push({
        dimension: "requirement_coverage",
        level: "Needs Improvement",
        classification: "A",
        message:
          "The submission does not provide enough evidence to judge requirement coverage.",
        evidence: {
          missingRequirements,
        },
      });
    }

    if (responsibilities.length >= entities.length && entities.length > 0) {
      findings.push({
        dimension: "responsibility_assignment",
        level: "Strong",
        classification: "B",
        message: "The proposed entities have explicit responsibilities.",
        evidence: {
          entityCount: entities.length,
          responsibilityCount: responsibilities.length,
        },
      });
    } else {
      findings.push({
        dimension: "responsibility_assignment",
        level: "Needs Improvement",
        classification: "A",
        message:
          "Some proposed entities do not have clearly stated responsibilities.",
        evidence: {
          entityCount: entities.length,
          responsibilityCount: responsibilities.length,
        },
      });
    }

    if (relationships.length >= 2) {
      findings.push({
        dimension: "structure_and_coupling",
        level: "Adequate",
        classification: "B",
        message:
          "The design describes relationships between multiple elements.",
        evidence: {
          relationships,
        },
      });
    } else {
      findings.push({
        dimension: "structure_and_coupling",
        level: "Needs Improvement",
        classification: "A",
        message:
          "The design needs clearer relationships between its proposed entities.",
        evidence: {
          relationships,
        },
      });
    }

    if (behaviors.length >= 2) {
      findings.push({
        dimension: "behavioral_coherence",
        level: "Adequate",
        classification: "B",
        message: "The submission describes multiple system behaviors.",
        evidence: {
          behaviors,
        },
      });
    } else {
      findings.push({
        dimension: "behavioral_coherence",
        level: "Needs Improvement",
        classification: "A",
        message: "The design should describe more system behaviors.",
        evidence: {
          behaviors,
        },
      });
    }

    if (designDecisions.length > 0) {
      findings.push({
        dimension: "extensibility_and_rationale",
        level: "Adequate",
        classification: "B",
        message:
          "The submission explains design decisions that provide rationale for the proposed structure.",
        evidence: {
          designDecisions,
        },
      });
    } else {
      findings.push({
        dimension: "extensibility_and_rationale",
        level: "Needs Improvement",
        classification: "A",
        message:
          "The design should explain important decisions and trade-offs.",
        evidence: {},
      });
    }

    return findings;
  }
}

module.exports = DefaultRubricPolicy;
