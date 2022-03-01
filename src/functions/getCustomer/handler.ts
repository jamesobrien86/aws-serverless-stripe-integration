import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	customerID: string;
}

const getCustomer = async (event: APIGatewayProxyEvent, context, callback) => {
	if (!event.body) {
		callback(Error("Invalid Body"), "Error");
		return;
	}
	const body = JSON.parse(event.body) as IBody;
	const { customerID } = body;

	if (!customerID) {
		callback(null, {
			statusCode: 400,
			body: "Missing subscription id",
		});
		return;
	}

	try {
		const customer = await stripe.customers.retrieve(customerID);

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
		callback(error, "Error");
	}
};

export const main = getCustomer;
