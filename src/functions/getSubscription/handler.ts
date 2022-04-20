import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	subscriptionID: string;
}

const getSubscription = async (
	event: APIGatewayProxyEvent,
	context,
	callback: (err: Error | null, data: any) => void
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
			body: "Missing Customer id",
		});
		return;
	}

	try {
		const product = await stripe.products.retrieve(subscriptionID);

		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
				"Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTION",
			},
			statusCode: 200,
			body: JSON.stringify(product),
		});
	} catch (error) {
		callback(error, "Error");
	}
};

export const main = getSubscription;
