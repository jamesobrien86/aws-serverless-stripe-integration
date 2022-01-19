export default {
	type: "object",
	properties: {
		email: { type: "string" },
		name: { type: "string" },
		productPlan: { type: "string" },
	},
	required: ["email"],
} as const;
