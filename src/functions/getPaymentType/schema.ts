export default {
	type: "object",
	properties: {
		paymentMethodID: { type: "string" },
	},
	required: ["paymentMethodID"],
} as const;
