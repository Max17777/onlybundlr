import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";

// gets the loaded balance in MATIC, not atomic units
export const getBalanceMatic = async () => {
	try {
		const bundlr = await getBundlr();
		const atomicBalance = await bundlr.getLoadedBalance();
		console.log("got atomicBalance=", atomicBalance);
		return bundlr.utils.unitConverter(atomicBalance).toString();
	} catch (e) {
		console.log("error on upload ", e);
	}
	return "";
};
