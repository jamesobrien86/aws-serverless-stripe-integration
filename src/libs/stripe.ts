import Stripe from "stripe";
export const stripe = new Stripe(
	"sk_test_51K9ScHFRQ26SmDFonEzlhDc72nXp2szuSeORmQINzaZYoZaXDtaKMdaMB6NQnCAWY0loAB61XZUxVaAmofn9s3a200enlKHQ2R" ||
		"",
	{
		apiVersion: "2020-08-27",
	}
);
