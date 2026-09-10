const API_BASE_URL = "http://localhost:3000/api";

/* request helper start here */

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object"
        ? data.message || "Something went wrong"
        : data || "Something went wrong";

    const error = new Error(message);

    error.status = response.status;
    error.details = typeof data === "object" ? data.details : undefined;

    throw error;
  }

  return data;
}

/* problem api start here */

export async function getProblems() {
  return request("/problems");
}

export async function getProblem(problemId) {
  return request(`/problems/${problemId}`);
}

/* attempt api start here */

export async function getProblemAttempts(problemId) {
  return request(`/problems/${problemId}/attempts`);
}

export async function getAttempt(attemptId) {
  return request(`/attempts/${attemptId}`);
}

/* submission api start here */

export async function submitDesign(problemId, designEvidence) {
  return request(`/problems/${problemId}/submissions`, {
    method: "POST",
    body: JSON.stringify({
      designEvidence,
    }),
  });
}

/* revision api start here */

export async function submitRevision(
  problemId,
  predecessorAttemptId,
  designEvidence,
) {
  return request(`/problems/${problemId}/submissions`, {
    method: "POST",
    body: JSON.stringify({
      predecessorAttemptId,
      designEvidence,
    }),
  });
}

/* evaluation api start here */

export async function retryEvaluation(attemptId) {
  return request(`/attempts/${attemptId}/evaluation/retry`, {
    method: "POST",
  });
}
