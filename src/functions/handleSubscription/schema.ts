export default {
	type: "object",
	properties: {
		subscriptionID: { type: "string" },
		end: { type: "boolean" },
	},
	required: ["subscriptionID", "end"],
} as const;
