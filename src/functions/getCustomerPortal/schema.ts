export default {
	type: "object",
	properties: {
		customer: { type: "string" },
		return_url: { type: "string" },
	},
	required: ["customer", "return_url"],
} as const;
