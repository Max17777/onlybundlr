import { getBundlr } from "./get-bundlr";
import BigNumber from "bignumber.js";

// takes the specified amount, converts to atomic units and funds the node
export const fundNode = async (fundAmount) => {
	try {
		const bundlr = await getBundlr();
		console.log("funding: ", fundAmount);
		console.log(
			"funding converted: ",
			new BigNumber(fundAmount).multipliedBy(bundlr.currencyConfig.base[1]).toString(),
		);

		const fundAmountParsed = new BigNumber(fundAmount).multipliedBy(bundlr.currencyConfig.base[1]);

		const tx = await bundlr.fund(fundAmountParsed);
		return "Node funded";
	} catch (e) {
		console.log("error on upload ", e);
		return "Error on fund: " + e;
	}
	return "";
};
