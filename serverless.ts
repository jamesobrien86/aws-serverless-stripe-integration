import type { AWS } from "@serverless/typescript";

import createCustomer from "@functions/createCustomer";
import createSubscription from "@functions/createSubscription";
import handleSubscription from "@functions/handleSubscription";
import getSubscription from "@functions/getSubscription";
import getPaymentType from "@functions/getPaymentType";
import updatePaymentMethod from "@functions/updatePaymentMethod";
import getCustomerPortal from "@functions/getCustomerPortal";
import getProductsList from "@functions/getProductsList";
import getCustomer from "@functions/getCustomer";
import updateCustomer from "@functions/updateCustomer";

const serverlessConfiguration: AWS = {
	service: "serverless-stripe-integration",
	app: "conclave-stripe-app",
	org: "jamesob86",
	frameworkVersion: "2",
	plugins: ["serverless-esbuild", "serverless-offline"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		region: "eu-west-1",
		stage: "dev",
		timeout: 12,
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
		},
		lambdaHashingVersion: "20201221",
	},
	// import the function via paths
	functions: {
		createCustomer,
		createSubscription,
		handleSubscription,
		getSubscription,
		getPaymentType,
		updatePaymentMethod,
		getCustomerPortal,
		getProductsList,
		getCustomer,
		updateCustomer,
	},
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
