import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	async init() {
		// Stripe customer list tool
		this.server.tool(
			"listStripeCustomers",
			{},
			async () => {
				try {
					const response = await fetch(
						'https://api.stripe.com/v1/customers',
						{
							headers: {
								'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					if (!response.ok) {
						const error = await response.json() as { error?: { message: string } };
						throw new Error(error.error?.message || 'Failed to fetch customers');
					}

					const customers = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(customers, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching customers: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						],
					};
				}
			}
		);

		// Stripe coupons list tool
		this.server.tool(
			"listStripeCoupons",
			{},
			async () => {
				try {
					const response = await fetch(
						'https://api.stripe.com/v1/coupons',
						{
							headers: {
								'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					if (!response.ok) {
						const error = await response.json() as { error?: { message: string } };
						throw new Error(error.error?.message || 'Failed to fetch coupons');
					}

					const coupons = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(coupons, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching coupons: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						],
					};
				}
			}
		);

		// Stripe products list tool
		this.server.tool(
			"listStripeProducts",
			{},
			async () => {
				try {
					const response = await fetch(
						'https://api.stripe.com/v1/products',
						{
							headers: {
								'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					if (!response.ok) {
						const error = await response.json() as { error?: { message: string } };
						throw new Error(error.error?.message || 'Failed to fetch products');
					}

					const products = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(products, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching products: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						],
					};
				}
			}
		);

		// Stripe prices list tool
		this.server.tool(
			"listStripePrices",
			{},
			async () => {
				try {
					const response = await fetch(
						'https://api.stripe.com/v1/prices',
						{
							headers: {
								'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					if (!response.ok) {
						const error = await response.json() as { error?: { message: string } };
						throw new Error(error.error?.message || 'Failed to fetch prices');
					}

					const prices = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(prices, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching prices: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						],
					};
				}
			}
		);

		// Stripe balance retrieve tool
		this.server.tool(
			"retrieveStripeBalance",
			{},
			async () => {
				try {
					const response = await fetch(
						'https://api.stripe.com/v1/balance',
						{
							headers: {
								'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					if (!response.ok) {
						const error = await response.json() as { error?: { message: string } };
						throw new Error(error.error?.message || 'Failed to retrieve balance');
					}

					const balance = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(balance, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error retrieving balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						],
					};
				}
			}
		);

		// Stripe subscriptions list tool
		this.server.tool(
			"listStripeSubscriptions",
			{},
			async () => {
				try {
					const response = await fetch(
						'https://api.stripe.com/v1/subscriptions',
						{
							headers: {
								'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
								'Content-Type': 'application/x-www-form-urlencoded',
							},
						}
					);

					if (!response.ok) {
						const error = await response.json() as { error?: { message: string } };
						throw new Error(error.error?.message || 'Failed to fetch subscriptions');
					}

					const subscriptions = await response.json();
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(subscriptions, null, 2),
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`,
							},
						],
					};
				}
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
