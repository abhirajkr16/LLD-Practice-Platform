const request = require("supertest");

const app = require("../src/server");

describe("API Layer", () => {
  it("should list problems", async () => {
    const response = await request(app).get("/api/problems");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should get a problem by id", async () => {
    const response = await request(app).get("/api/problems/parking-lot-001");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("parking-lot-001");
    expect(response.body.title).toBe("Design a Parking Lot System");
  });

  it("should return attempts for a problem", async () => {
    const response = await request(app).get(
      "/api/problems/parking-lot-001/attempts",
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should submit a design", async () => {
    const response = await request(app)
      .post("/api/problems/parking-lot-001/submissions")
      .send({
        designEvidence: {
          entities: ["ParkingLot", "ParkingFloor", "ParkingSpot", "Vehicle"],
          responsibilities: [
            "ParkingLot manages floors",
            "ParkingFloor manages parking spots",
            "ParkingSpot tracks occupancy",
            "Vehicle represents the parked vehicle",
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
          designDecisions: ["Pricing is isolated from parking allocation"],
          interfaces: ["PricingStrategy"],
          assumptions: ["A vehicle can occupy one parking spot at a time"],
        },
      });

    expect(response.status).toBe(201);

    expect(response.body.attempt).toBeDefined();
    expect(response.body.submission).toBeDefined();
    expect(response.body.evaluation).toBeDefined();

    expect(response.body.evaluation.status).toBe("evaluating");
  });
});
