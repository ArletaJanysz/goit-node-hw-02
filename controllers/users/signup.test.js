import request from "supertest";
import app from "../../app.js";

describe("Signup Controller", () => {
	it("should return 201 with user object on successful signup", async () => {
		const response = await request(app).post("/signup").send({
			email: "newuser@example.com",
			password: "newpassword",
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("user");
		expect(response.body.user).toHaveProperty("email");
		expect(response.body.user).toHaveProperty("subscription");
		expect(typeof response.body.user.email).toBe("string");
		expect(typeof response.body.user.subscription).toBe("string");
	});

	it("should return 400 on invalid signup data", async () => {
		const response = await request(app).post("/signup").send({
			email: "invalidemail",
			password: "short",
		});

		expect(response.status).toBe(400);
	});

	it("should return 409 when email is already in use", async () => {
		const response = await request(app).post("/signup").send({
			email: "test@example.com",
			password: "testpassword",
		});

		expect(response.status).toBe(409);
	});
});
