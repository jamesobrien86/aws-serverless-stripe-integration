import { APIGatewayProxyEvent } from "aws-lambda";
import { stripe } from "../../libs/stripe";

interface IBody {
	subscriptionID: string;
	end: boolean;
}

const handleSubscription = async (
	event: APIGatewayProxyEvent,
	context: any,
	callback: (err: Error | null, data: any) => void
) => {
	if (!event.body) {
		callback(Error("Invalid body"), "Error");
	}

	const body = JSON.parse(event.body) as IBody;
	const { subscriptionID, end } = body;

	if (!subscriptionID || end === undefined) {
		callback(null, {
			statusCode: 400,
			body: "Missing subscription id",
		});
		return;
	}

	try {
		const subscription = await stripe.subscriptions.update(subscriptionID, {
			cancel_at_period_end: end,
		});

		callback(null, {
			statusCode: 200,
			body: JSON.stringify(subscription),
		});
	} catch (error) {
		callback(error, "Error");
	}
};

export const main = handleSubscription;
