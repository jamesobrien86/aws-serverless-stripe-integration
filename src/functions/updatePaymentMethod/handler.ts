import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	paymentMethodID: string;
	customerID: string;
	invoiceID: string;
}

const updatePaymetMethod = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	if (!event.body) {
		callback(Error("Invalid Body"), "Error");
		return;
	}

	const body = JSON.parse(event.body) as IBody;
	const { paymentMethodID, customerID, invoiceID } = body;
	if (!paymentMethodID || !customerID || invoiceID) {
		callback(null, {
			statusCode: 400,
			body: "Invalid payment method or customer ID",
		});
		return;
	}
	try {
		// Attach the new payment method
		await stripe.paymentMethods.attach(paymentMethodID, {
			customer: customerID,
		});
		// Update default payment method on customer
		await stripe.customers.update(customerID, {
			invoice_settings: {
				default_payment_method: paymentMethodID,
			},
		});
		// Retrieve the invoice
		const invoice = await stripe.invoices.retrieve(invoiceID, {
			expand: ["payment_intent"],
		});
		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
			},
			statusCode: 200,
			body: JSON.stringify(invoice),
		});
	} catch (error) {
		callback(error);
	}
};

export const main = updatePaymetMethod;
