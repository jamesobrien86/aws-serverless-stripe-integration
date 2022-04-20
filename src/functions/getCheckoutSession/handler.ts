import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	customer_session_id: string;
}

const getCheckoutSession = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	if (!event.body) {
		callback(null, Error("Invalid body"));
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { customer_session_id } = body;
	if (!customer_session_id) {
		callback(null, {
			statusCode: 400,
			body: "Missing customer_session_id",
		});
		return;
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(
			"cs_test_a14NXIYWFwUj7WbKZmBX2cD1vbwGQMxxPIFZGtobtxaiRmiMMZywP3SiOK"
		);
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
		callback(error, "Error");
	}
};

export const main = getCheckoutSession;
