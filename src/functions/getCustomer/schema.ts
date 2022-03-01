export default {
	type: "object",
	properties: {
		customerID: { type: "string" },
	},
	required: ["customerID"],
} as const;
