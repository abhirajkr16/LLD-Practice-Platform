const Evaluator = require("../../application/ports/Evaluator");
const FeedbackReport = require("../../domain/feedback/FeedbackReport");

class DeterministicEvaluator extends Evaluator {
  constructor({ rubricPolicy }) {
    super();
    this.rubricPolicy = rubricPolicy;
  }

  evaluate(problem, submission) {
    const findings = this.rubricPolicy.evaluate(
      problem,
      submission.getDesignEvidence(),
    );

    const priorityFindings = findings
      .filter(
        (finding) =>
          finding.level === "Critical Gap" ||
          finding.level === "Needs Improvement",
      )
      .slice(0, 1);

    const secondaryFindings = findings
      .filter(
        (finding) =>
          finding.level === "Needs Improvement" || finding.level === "Adequate",
      )
      .filter((finding) => !priorityFindings.includes(finding))
      .slice(0, 2);

    const optionalFindings = findings
      .filter((finding) => finding.level === "Strong")
      .slice(0, 2);

    const overallAssessment = this.getOverallAssessment(findings);

    return new FeedbackReport({
      overallAssessment,
      dimensionFindings: findings,
      priorityFindings,
      secondaryFindings,
      optionalFindings,
    });
  }

  getOverallAssessment(findings) {
    const criticalGaps = findings.filter(
      (finding) => finding.level === "Critical Gap",
    );

    const improvements = findings.filter(
      (finding) => finding.level === "Needs Improvement",
    );

    if (criticalGaps.length > 0) {
      return "The design has critical gaps that make important parts of the design difficult to evaluate.";
    }

    if (improvements.length >= 3) {
      return "The design needs improvement across several important areas.";
    }

    if (improvements.length > 0) {
      return "The design has a reasonable foundation but has a few areas that should be strengthened.";
    }

    return "The design provides evidence across the main evaluation dimensions.";
  }
}

module.exports = DeterministicEvaluator;
