import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	subscriptionID: string;
}

const getSubscription = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	if (!event.body) {
		callback(Error("Invalid Body"), "Error");
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { subscriptionID } = body;

	if (!subscriptionID) {
		callback(null, {
			statusCode: 400,
			body: "Missing subscription id",
		});
		return;
	}

	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionID);

		callback(null, {
			statusCode: 200,
			body: JSON.stringify(subscription),
		});
	} catch (error) {
		callback(error, "Error");
	}
};

export const main = getSubscription;
