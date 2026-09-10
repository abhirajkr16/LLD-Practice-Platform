CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    statement TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    requirements TEXT NOT NULL,
    constraints TEXT NOT NULL,
    scope TEXT NOT NULL,
    edge_cases TEXT NOT NULL,
    intent TEXT NOT NULL,
    change_scenario TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    problem_id TEXT NOT NULL,
    predecessor_attempt_id TEXT,
    created_at TEXT NOT NULL,

    FOREIGN KEY (problem_id)
        REFERENCES problems(id),

    FOREIGN KEY (predecessor_attempt_id)
        REFERENCES attempts(id)
);

CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL UNIQUE,
    design_evidence TEXT NOT NULL,
    created_at TEXT NOT NULL,

    FOREIGN KEY (attempt_id)
        REFERENCES attempts(id)
);

CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL UNIQUE,
    submission_id TEXT NOT NULL UNIQUE,
    evaluator_kind TEXT NOT NULL,
    status TEXT NOT NULL,
    feedback TEXT,
    failure TEXT,

    FOREIGN KEY (attempt_id)
        REFERENCES attempts(id),

    FOREIGN KEY (submission_id)
        REFERENCES submissions(id)
);