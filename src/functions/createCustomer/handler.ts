import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import Stripe from "stripe";
const stripe = new Stripe("enter key" || "", {
	apiVersion: "2020-08-27",
});
interface IBody {
	email: string;
	username: string;
}

const createCustomer = async (
	event: APIGatewayProxyEvent,
	context: any,
	callback: (err: Error | null, data: any) => void
) => {
	if (!event.body) {
		callback(null, Error("Invalid body"));
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { email, username } = body;
	if (!email || !username) {
		callback(null, {
			statusCode: 400,
			body: "Missing email or username",
		});
		return;
	}
	try {
		// Create a new customer
		const customer = await stripe.customers.create({
			email,
			name: username,
		});
		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
			},
			statusCode: 200,
			body: JSON.stringify(customer),
		});
	} catch (error) {
		callback(error, "error");
	}
};

export const main = createCustomer;
