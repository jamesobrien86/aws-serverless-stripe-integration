import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IBody {
	data: any;
}

const getProductsList = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	// var token = event.authorizationToken;
	try {
		const productList = await stripe.products.list({
			limit: 3,
			active: true,
			expand: ["data.prices"],
		});

		console.log(event, "event");

		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
			},
			statusCode: 200,
			body: JSON.stringify(event),
		});
	} catch (error) {
		callback(error, "Error");
	}
};

export const main = getProductsList;
