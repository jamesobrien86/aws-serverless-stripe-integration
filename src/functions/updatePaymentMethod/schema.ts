export default {
	type: "object",
	properties: {
		paymentMethodID: { type: "string" },
		customerID: { type: "string" },
		invoiceID: { type: "string" },
	},
	required: ["paymentMethodID"],
} as const;
