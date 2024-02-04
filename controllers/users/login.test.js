import request from "supertest";
import app from "../../app.js";
describe("Login Controller", () => {
	it("should return 200 with token and user object on successful login", async () => {
		const response = await request(app).post("/login").send({
			email: "test@example.com",
			password: "testpassword",
		});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body).toHaveProperty("user");
		expect(response.body.user).toHaveProperty("email");
		expect(response.body.user).toHaveProperty("subscription");
		expect(typeof response.body.token).toBe("string");
		expect(typeof response.body.user.email).toBe("string");
		expect(typeof response.body.user.subscription).toBe("string");
	});

	it("should return 400 on invalid login data", async () => {
		const response = await request(app).post("/login").send({
			email: "invalidemail",
			password: "short",
		});

		expect(response.status).toBe(400);
	});

	it("should return 401 when email or password is wrong", async () => {
		const response = await request(app).post("/login").send({
			email: "nonexistentuser@example.com",
			password: "wrongpassword",
		});

		expect(response.status).toBe(401);
	});
});
