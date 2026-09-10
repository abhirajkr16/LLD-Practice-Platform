const request = require("supertest");

const app = require("../src/server");

describe("Retry Evaluation API", () => {
  it("should not retry an evaluation that already has feedback", async () => {
    const submitResponse = await request(app)
      .post("/api/problems/parking-lot-001/submissions")
      .send({
        designEvidence: {
          entities: ["ParkingLot", "ParkingFloor", "ParkingSpot", "Vehicle"],
          responsibilities: [
            "ParkingLot manages floors",
            "ParkingFloor manages parking spots",
            "ParkingSpot tracks occupancy",
            "Vehicle represents the vehicle",
          ],
          relationships: [
            "ParkingLot contains ParkingFloor",
            "ParkingFloor contains ParkingSpot",
          ],
          behaviors: [
            "Park vehicle",
            "Remove vehicle",
            "Calculate parking fee",
          ],
          designDecisions: ["Pricing is separated from parking allocation"],
          interfaces: ["PricingStrategy"],
          assumptions: ["A vehicle occupies one parking spot"],
        },
      });

    expect(submitResponse.status).toBe(201);

    const attemptId = submitResponse.body.attempt.id;

    const retryResponse = await request(app).post(
      `/api/attempts/${attemptId}/evaluation/retry`,
    );

    expect(retryResponse.status).toBe(422);

    expect(retryResponse.body.error.code).toBe("INVALID_REQUEST");

    const db = require("../src/database/connection");
    db.prepare("DELETE FROM evaluations WHERE id = ?").run(
      submitResponse.body.evaluation.id,
    );
    db.prepare("DELETE FROM submissions WHERE id = ?").run(
      submitResponse.body.submission.id,
    );
    db.prepare("DELETE FROM attempts WHERE id = ?").run(attemptId);
  });
});
