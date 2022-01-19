import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	paymentMethodID: string;
}

const getPaymentType = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	if (!event.body) {
		callback(Error("Invalid Body"), "Error");
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { paymentMethodID } = body;

	if (!paymentMethodID) {
		callback(null, {
			statusCode: 400,
			body: "Invalid payment method",
		});
		return;
	}

	try {
		const paymentMethod = await stripe.subscriptions.retrieve(paymentMethodID);

		callback(null, {
			statusCode: 200,
			body: JSON.stringify(paymentMethod),
		});
	} catch (error) {
		callback(error, "Error");
	}
};

export const main = getPaymentType;
