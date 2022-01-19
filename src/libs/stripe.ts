import Stripe from "stripe";
export const stripe = new Stripe(
	"sk_test_51KFG8gFe3afnmlSvPXBZNTmDiggMyoTiKpU5G0CGgSF8jrz9ZsZ1JrAfO75ZBzDB1Cgp4MJELRL79y6NYCfghjda00bs7mll5N" ||
		"",
	{
		apiVersion: "2020-08-27",
	}
);
