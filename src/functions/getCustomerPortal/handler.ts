import { APIGatewayProxyEvent } from "aws-lambda";
import axios from "axios";
import { stripe } from "../../libs/stripe";

interface IBody {
	customer: string;
	return_url: string;
}

const getCustomerPortal = async (
	event: APIGatewayProxyEvent,
	context: any,
	callback: (err: Error | null, data: any) => void
) => {
	if (!event.body) {
		callback(null, Error("Invalid body"));
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { customer, return_url } = body;
	if (!customer || !return_url) {
		callback(null, {
			statusCode: 400,
			body: "Missing customer or url",
		});
		return;
	}
	const configuration = await stripe.billingPortal.configurations.create({
		business_profile: {
			privacy_policy_url: "http://localhost:3001/privacy",
			terms_of_service_url: "https://localhost:3001/terms",
		},
		features: {
			invoice_history: {
				enabled: true,
			},
		},
	});

	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: customer,
			return_url: return_url,
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

export const main = getCustomerPortal;
