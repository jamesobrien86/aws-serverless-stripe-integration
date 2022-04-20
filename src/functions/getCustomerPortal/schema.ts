export default {
	type: "object",
	properties: {
		customer: { type: "string" },
		return_url: { type: "string" },
	},
	required: ["return_url"],
} as const;
