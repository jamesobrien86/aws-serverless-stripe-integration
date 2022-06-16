import { stripe } from "@libs/stripe";
import { APIGatewayProxyEvent } from "aws-lambda";

// interface IBody {
// 	customerID: string;
// 	name: string;
// 	email: string;
// }

const setUsageRecord = async (
	event: APIGatewayProxyEvent,
	context,
	callback
) => {
	// if (!event.body) {
	// 	callback(Error("Invalid Body"), "Error");
	// 	return;
	// }
	// const body = JSON.parse(event.body) as IBody;
	// const { customerID } = body;

	// if (!customerID) {
	// 	callback(null, {
	// 		statusCode: 400,
	// 		body: "Missing customer id",
	// 	});
	// 	return;
	// }

	var currentTimestamp = Math.ceil(Date.now() / 1000);

	try {
		const usageRecord = await stripe.subscriptionItems.createUsageRecord(
			"si_LS2Y7WlSusaPBt",
			{
				quantity: 2,
				timestamp: currentTimestamp,
				action: "increment",
			}
		);
		callback(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "x-requested-with",
				"Access-Control-Allow-Credentials": true,
			},
			statusCode: 200,
			body: JSON.stringify(usageRecord),
		});
	} catch (error) {
		callback(error, "Error");
	}
};

export const main = setUsageRecord;
