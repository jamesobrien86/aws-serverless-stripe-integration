import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	customerID: string;
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
	const { customerID } = body;

	if (!customerID) {
		callback(null, {
			statusCode: 400,
			body: "Missing Customer id",
		});
		return;
	}

	try {
		const customerSubscriptions: any = await stripe.customers.retrieve(
			customerID,
			{
				expand: ["subscriptions.data"],
			}
		);

		let { data } = customerSubscriptions.subscriptions;

		const subID = data[0].plan.product;

		const product = await stripe.products.retrieve(subID);

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
