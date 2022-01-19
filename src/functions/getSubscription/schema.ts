export default {
	type: "object",
	properties: {
		subscriptionID: { type: "string" },
	},
	required: ["subscriptionID"],
} as const;
