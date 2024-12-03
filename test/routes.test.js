const request = require("supertest");
const app = require("../app"); // Certifique-se de exportar o `app` no `app.js`
const { connectDB, disconnectDB } = require("./setupTestDB");
const Seed = require("../models/seedModel");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("API Integration Tests", () => {
  let seedData;

  beforeEach(async () => {
    // Inserir dados de teste no banco em memória
    seedData = await Seed.create({
      service: "Google",
      account: "test@gmail.com",
      seed: "test-seed-123",
      pass: "senha-teste",
    });
  });

  afterEach(async () => {
    await Seed.deleteMany(); // Limpar o banco após cada teste
  });

  test("GET /api/seed/:id - Deve retornar uma seed pelo ID", async () => {
    const res = await request(app).get(`/api/seed/${seedData.seed}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.seed).toBe(seedData.seed);
    expect(res.body.account).toBe(seedData.account);
  });

  test("POST /api/pass - Deve gerar um pass", async () => {
    const res = await request(app)
      .post("/api/pass")
      .send({ seed: seedData.seed });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Pass gerado e criptografado com sucesso!");
    expect(res.body.pass).toBeDefined();
  });

  test("POST /api/seed/search - Deve retornar seeds filtradas", async () => {
    const res = await request(app)
      .post("/api/seed/search")
      .send({ service: "Google", account: "test@gmail.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.seeds).toHaveLength(1);
    expect(res.body.seeds[0].seed).toBe(seedData.seed);
  });
});