const db = require("./init");

const problems = [
  {
    id: "parking-lot-001",
    title: "Design a Parking Lot System",
    statement:
      "Design a parking lot management system that supports multiple floors, different vehicle types, parking spot allocation, vehicle entry and exit, and fee calculation.",
    difficulty: "medium",
    requirements: [
      "Support multiple parking floors",
      "Support different vehicle types",
      "Allocate suitable parking spots",
      "Track vehicle entry and exit",
      "Calculate parking fees",
    ],
    constraints: [
      "The design should support future changes in pricing rules",
      "The system should maintain parking spot availability",
    ],
    scope: {
      inScope: [
        "Parking lot structure",
        "Spot allocation",
        "Vehicle entry and exit",
        "Fee calculation",
      ],
      outOfScope: [
        "Payment gateway integration",
        "Authentication and authorization",
      ],
    },
    edgeCases: [
      "Parking lot is full",
      "No suitable spot is available",
      "Vehicle exits without a valid parking record",
    ],
    intent:
      "Evaluate object-oriented design, responsibility assignment, relationships, behavior modeling, and extensibility.",
    changeScenario:
      "Pricing rules may change based on vehicle type or future pricing policies.",
  },
  {
    id: "elevator-001",
    title: "Design an Elevator System",
    statement:
      "Design an elevator system that manages multiple elevators, floor requests, elevator movement, and request assignment.",
    difficulty: "medium",
    requirements: [
      "Support multiple elevators",
      "Accept floor requests",
      "Assign requests to elevators",
      "Track elevator movement and direction",
      "Handle internal and external requests",
    ],
    constraints: [
      "The design should support different elevator selection strategies",
    ],
    scope: {
      inScope: [
        "Elevator management",
        "Request handling",
        "Elevator assignment",
        "Movement and direction",
      ],
      outOfScope: [
        "Physical hardware control",
        "Authentication and authorization",
      ],
    },
    edgeCases: [
      "All elevators are busy",
      "Multiple requests target the same floor",
      "An elevator receives a request while moving",
    ],
    intent:
      "Evaluate object-oriented design, responsibility assignment, behavioral modeling, and extensibility.",
    changeScenario:
      "The elevator selection strategy may change as the system evolves.",
  },
];

const insert = db.prepare(`
    INSERT OR IGNORE INTO problems (
        id,
        title,
        statement,
        difficulty,
        requirements,
        constraints,
        scope,
        edge_cases,
        intent,
        change_scenario
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedProblems = db.transaction(() => {
  for (const problem of problems) {
    insert.run(
      problem.id,
      problem.title,
      problem.statement,
      problem.difficulty,
      JSON.stringify(problem.requirements),
      JSON.stringify(problem.constraints),
      JSON.stringify(problem.scope),
      JSON.stringify(problem.edgeCases),
      problem.intent,
      problem.changeScenario,
    );
  }
});

seedProblems();

console.log("MVP problems seeded successfully.");
