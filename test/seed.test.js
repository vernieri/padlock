const request = require("supertest");
const app = require("../app");
const { connectDB, disconnectDB } = require("./setupTestDB");

let token;

beforeAll(async () => {
  await connectDB();
  const res = await request(app).post("/api/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });
  token = res.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe("Seed API", () => {
  test("Deve criar uma nova seed", async () => {
    const res = await request(app)
      .post("/api/seed")
      .set("Authorization", `Bearer ${token}`)
      .send({
        service: "Google",
        account: "test@gmail.com",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.service).toBe("Google");
  });

  test("Deve retornar um erro para uma requisição sem token", async () => {
    const res = await request(app).post("/api/seed").send({
      service: "Google",
      account: "test@gmail.com",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Acesso negado, token não fornecido");
  });
});
