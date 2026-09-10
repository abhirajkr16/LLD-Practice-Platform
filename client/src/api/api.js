const API_BASE_URL = "http://localhost:3000/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data;
}

export async function getProblems() {
  return request("/problems");
}

export async function getProblem(problemId) {
  return request(`/problems/${problemId}`);
}

export async function getProblemAttempts(problemId) {
  return request(`/problems/${problemId}/attempts`);
}

export async function submitDesign(problemId, designEvidence) {
  return request(`/problems/${problemId}/submissions`, {
    method: "POST",
    body: JSON.stringify({
      designEvidence,
    }),
  });
}

export async function getAttempt(attemptId) {
  return request(`/attempts/${attemptId}`);
}

export async function retryEvaluation(attemptId) {
  return request(`/attempts/${attemptId}/evaluation/retry`, {
    method: "POST",
  });
}
