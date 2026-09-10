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

  {
    id: "movie-booking-001",
    title: "Design a Movie Ticket Booking System",
    statement:
      "Design a movie ticket booking system that allows users to browse movies, select theatres and shows, view available seats, book seats, cancel bookings, and calculate booking amounts.",
    difficulty: "medium",
    requirements: [
      "Support multiple theatres",
      "Support multiple screens per theatre",
      "Support multiple movies",
      "Support multiple shows",
      "Display available seats",
      "Allow users to select seats",
      "Create ticket bookings",
      "Prevent duplicate seat bookings",
      "Cancel bookings",
      "Calculate booking amount",
    ],
    constraints: [
      "A seat can be booked only once for a particular show",
      "A screen can host multiple shows at different times",
      "A booking must belong to a specific show",
      "Cancelled seats should become available again",
      "Seat availability must be maintained independently for each show",
    ],
    scope: {
      inScope: [
        "Movie management",
        "Theatre management",
        "Screen management",
        "Show management",
        "Seat management",
        "Booking management",
        "Booking cancellation",
        "Pricing",
      ],
      outOfScope: [
        "Payment gateway implementation",
        "User authentication",
        "Notifications",
        "Movie recommendation",
      ],
    },
    edgeCases: [
      "Two users attempt to book the same seat",
      "A show is cancelled",
      "A booking is cancelled",
      "A user selects an unavailable seat",
      "A theatre contains multiple screens",
      "The same movie has multiple shows",
    ],
    intent:
      "Evaluate object-oriented design, relationships, state management, responsibility assignment, and extensibility.",
    changeScenario:
      "The business wants different pricing rules for weekdays, weekends, premium seats, and special events without modifying the core booking logic.",
  },

  {
    id: "ride-sharing-001",
    title: "Design a Ride Sharing System",
    statement:
      "Design a ride sharing system that allows riders to request rides, matches them with suitable drivers, manages ride lifecycle states, calculates fares, and supports different vehicle and pricing options.",
    difficulty: "hard",
    requirements: [
      "Allow riders to request rides",
      "Allow drivers to become available or unavailable",
      "Match riders with suitable drivers",
      "Track ride status",
      "Start and complete rides",
      "Cancel rides",
      "Calculate ride fares",
      "Support different vehicle types",
      "Maintain driver and rider information",
    ],
    constraints: [
      "A driver should not be assigned to multiple active rides",
      "A ride must have exactly one rider",
      "A ride may be cancelled before completion",
      "The matching strategy should be replaceable",
      "The pricing strategy should be replaceable",
    ],
    scope: {
      inScope: [
        "Rider management",
        "Driver management",
        "Ride requests",
        "Driver matching",
        "Ride lifecycle",
        "Vehicle types",
        "Fare calculation",
      ],
      outOfScope: [
        "Real-time GPS implementation",
        "Payment gateway integration",
        "Authentication and authorization",
        "Maps and navigation APIs",
      ],
    },
    edgeCases: [
      "No available driver exists",
      "Multiple drivers are suitable for the same ride",
      "A driver cancels after accepting a ride",
      "A rider cancels before the ride starts",
      "A driver already has an active ride",
      "The ride is completed before cancellation",
    ],
    intent:
      "Evaluate object-oriented design, state modeling, responsibility assignment, strategy patterns, and extensibility.",
    changeScenario:
      "The platform wants to introduce different driver matching and fare calculation strategies without changing the core ride management logic.",
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
