import { getBundlr } from "./get-bundlr";

// gets the loaded balance in MATIC, not atomic units
export const getBalanceMatic = async () => {
	try {
		const bundlr = await getBundlr();
		const atomicBalance = await bundlr.getLoadedBalance();

		return bundlr.utils.unitConverter(atomicBalance).toString();
	} catch (e) {
		console.log("error on getBalanceMatic ", e);
	}
	return "";
};
