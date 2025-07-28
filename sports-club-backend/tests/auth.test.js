const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Assuming your Express app is exported from server.js

// Import your models for cleanup if necessary
const User = require("../models/User");

// Mock the security middleware to disable rate limiting for tests
jest.mock("../middleware/security", () => {
  const originalModule = jest.requireActual("../middleware/security");
  return {
    ...originalModule,
    authLimiter: (req, res, next) => next(), // Disable rate limiting for auth endpoints
    apiLimiter: (req, res, next) => next(), // Disable rate limiting for general API endpoints
    // Keep other exports as their original implementation or mock if they cause issues
  };
});

// Connect to a test database before all tests
beforeAll(async () => {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://localhost:27017/sports-club-test";
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the database and close the connection after all tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth API", () => {
  // Clear users collection before each test to ensure a clean state
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "testuser", // Corrected to 'name'
      email: "test@example.com",
      password: "Password123!", // Updated to meet validation requirements
      role: "member",
    });
    expect(res.statusCode).toEqual(201);
    // Register endpoint does not return a token, it only returns user data.
    // The token is returned by the login endpoint.
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    expect(res.body.data).toHaveProperty("name", "testuser"); // Corrected to 'name'
  });

  it("should not register a user with an existing email", async () => {
    // Register the first user
    await request(app).post("/api/auth/register").send({
      name: "Test User One", // Corrected to meet name validation (no numbers)
      email: "duplicate@example.com",
      password: "Password123!",
      role: "member",
    });

    // Try to register with the same email
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User Two",
      email: "duplicate@example.com",
      password: "Password456!", // Updated to meet validation requirements
      role: "member",
    });
    expect(res.statusCode).toEqual(400); // Bad Request due to validation or duplicate
    // The error message for duplicate email comes from AppError in authController.js
    // Check both potential error message paths, as validation errors might return 'message' directly.
    console.log("Response Body (Duplicate Email Test):", res.body); // Add debug log
    const errorMessage = res.body.error?.message || res.body.message;
    expect(errorMessage).toContain("Email already registered");
  });

  it("should log in an existing user", async () => {
    // First, register a user
    await request(app).post("/api/auth/register").send({
      name: "loginuser", // Corrected to 'name'
      email: "login@example.com",
      password: "Password123!", // Updated to meet validation requirements
      role: "member",
    });

    // Then, attempt to log in
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com", // Corrected typo
      password: "Password123!", // Updated to match registered user
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toHaveProperty("email", "login@example.com");
  });

  it("should not log in with incorrect password", async () => {
    // First, register a user
    await request(app).post("/api/auth/register").send({
      name: "wrongpassuser", // Corrected to 'name'
      email: "wrongpass@example.com",
      password: "Password123Correct!", // Updated to meet validation requirements
      role: "member",
    });

    // Then, attempt to log in with wrong password
    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@example.com",
      password: "IncorrectPassword!", // Ensure it's different and still valid format if validation applies here
    });
    expect(res.statusCode).toEqual(401); // Unauthorized
    // The error message for invalid credentials comes from AppError in authController.js
    expect(res.body.error.message).toContain("Invalid credentials"); // Corrected path to message and casing
  });

  it("should get user profile with a valid token", async () => {
    // First, register a user
    await request(app).post("/api/auth/register").send({
      name: "profileuser", // Corrected to 'name'
      email: "profile@example.com",
      password: "Password123!", // Updated to meet validation requirements
      role: "member",
    });

    // Then, log in to get a token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "profile@example.com",
      password: "Password123!", // Updated to match registered user
    });

    const token = loginRes.body.data.token; // Access token from the 'data' property of the login response

    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`); // Set the Authorization header

    expect(profileRes.statusCode).toEqual(200);
    expect(profileRes.body.data).toHaveProperty("email", "profile@example.com"); // Access profile data from the 'data' property
    expect(profileRes.body.data).toHaveProperty("name", "profileuser"); // Access profile data from the 'data' property
  });

  it("should not get user profile without a token", async () => {
    const res = await request(app).get("/api/auth/profile"); // No token
    expect(res.statusCode).toEqual(401); // Unauthorized
    expect(res.body.message).toContain("No token"); // Corrected expected message
  });

  it("should not get user profile with an invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", "Bearer invalidtoken123"); // Invalid token
    expect(res.statusCode).toEqual(401); // Unauthorized
    expect(res.body.message).toContain("Token invalid"); // Corrected expected message from authMiddleware
  });
});
