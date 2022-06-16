import { APIGatewayProxyEvent } from "aws-lambda";
import axios from "axios";
import { stripe } from "../../libs/stripe";

interface IBody {
	customer_email: string;
	customer_id: string;
	return_url: string;
	business_name: string;
}

const createCheckoutSession = async (
	event: APIGatewayProxyEvent,
	context: any,
	callback: (err: Error | null, data: any) => void
) => {
	if (!event.body) {
		callback(null, Error("Invalid body"));
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { customer_email, return_url, customer_id, business_name } = body;
	if (!return_url && !customer_email && !customer_id && !business_name) {
		callback(null, {
			statusCode: 400,
			body: "Missing url or customer email",
		});
		return;
	}

	try {
		const session = await stripe.checkout.sessions.create({
			success_url: return_url + "/success?session_id={CHECKOUT_SESSION_ID}",
			cancel_url: return_url,
			mode: "subscription",
			customer_email: customer_email,
			billing_address_collection: "required",
			metadata: {
				customer_id: customer_id,
				business_name: business_name,
			},
			subscription_data: {
				items: [
					{
						// hardcored plan id will come from signup when we have a plan
						plan: "prod_LQa1HdSm54rJDx",
					},
				],
			},
		});
		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
			},
			statusCode: 200,
			body: JSON.stringify(session),
		});
	} catch (error) {
		callback(error, "error");
	}
};

export const main = createCheckoutSession;
