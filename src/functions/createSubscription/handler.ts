import { APIGatewayProxyEvent } from "aws-lambda";
import Stripe from "stripe";
const stripe = new Stripe(
	"sk_test_51KFG8gFe3afnmlSvPXBZNTmDiggMyoTiKpU5G0CGgSF8jrz9ZsZ1JrAfO75ZBzDB1Cgp4MJELRL79y6NYCfghjda00bs7mll5N" ||
		"",
	{
		apiVersion: "2020-08-27",
	}
);
interface IBody {
	email: string;
	username: string;
	productPlan: string;
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
	const { email, username, productPlan } = body;
	if (!email || !username || !productPlan) {
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
			name: username,
		});
		const customerId = customer.id;

		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [{ plan: productPlan }],
		});

		callback(null, {
			statusCode: 200,
			body: JSON.stringify(subscription),
		});
	} catch (error) {
		callback(error, "error");
	}
};

export const main = createSubscription;
