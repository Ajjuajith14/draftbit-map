import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Map API worker", () => {
	it("responds with health message (unit style)", async () => {
		const request = new IncomingRequest("http://example.com");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ message: "Map API Worker is running." });
	});

	it("responds with health message (integration style)", async () => {
		const response = await SELF.fetch("https://example.com");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ message: "Map API Worker is running." });
	});

	it("handles CORS preflight requests", async () => {
		const response = await worker.fetch(
			new IncomingRequest("http://example.com/locations", { method: "OPTIONS" }),
			env,
			createExecutionContext(),
		);

		expect(response.status).toBe(204);
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
		expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, OPTIONS");
	});

	it("returns static locations for /locations", async () => {
		const response = await worker.fetch(
			new IncomingRequest("http://example.com/locations"),
			env,
			createExecutionContext(),
		);
		const body = (await response.json()) as Array<{
			latitude: number;
			longitude: number;
			name: string;
			category: string;
		}>;

		expect(response.status).toBe(200);
		expect(body).toHaveLength(10);
		expect(body[0]).toEqual(
			expect.objectContaining({
				id: "static-eiffel-tower",
				name: "Eiffel Tower",
				latitude: 48.85837,
				longitude: 2.294481,
				category: "Landmark",
			}),
		);
		expect(body.every((location) => Number.isFinite(location.latitude))).toBe(true);
		expect(body.every((location) => Number.isFinite(location.longitude))).toBe(true);
	});

	it("returns 404 for unknown routes", async () => {
		const response = await worker.fetch(
			new IncomingRequest("http://example.com/missing"),
			env,
			createExecutionContext(),
		);

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ error: "Route not found." });
	});
});
