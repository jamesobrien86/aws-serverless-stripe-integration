import { APIGatewayProxyEvent } from "aws-lambda";
import { stripe } from "../../libs/stripe";

interface IBody {
	email: string;
	username: string;
	productPlan: string;
	name: string;
}

const createSubscription = async (
	event: APIGatewayProxyEvent,
	context: any,
	callback: (err: Error | null, data: any) => void
) => {
	if (!event.body) {
		callback(null, Error("Invalid body"));
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { email, name, productPlan } = body;
	if (!email || !name || !productPlan) {
		callback(null, {
			statusCode: 400,
			body: "Missing email or username or product id",
		});
		return;
	}
	try {
		// Create a new customer
		const customer = await stripe.customers.create({
			email,
			name,
		});
		const customerId = customer.id;

		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [{ price: productPlan }],
		});

		console.log(subscription);
		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
			},
			statusCode: 200,
			body: JSON.stringify(subscription),
		});
	} catch (error) {
		callback(error, "error");
	}
};

export const main = createSubscription;
