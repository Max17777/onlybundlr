import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";

export const upload = async (data) => {
	//TODO: add app id

	try {
		const bundlr = await getBundlr();
		console.log("bundlr=", bundlr);
		const serialized = JSON.stringify(data);
		console.log("serialized=", serialized);

		const price = await bundlr.getPrice(new Blob([serialized]).size);
		console.log("funding");
		await bundlr.fund(price);

		// const balance = await bundlr.getLoadedBalance();
		// console.log("price=", price.toString());
		// console.log("balance=", balance.toString());

		// if (price.multipliedBy(1.2) >= balance) {
		// 	console.log("funding");
		// }

		const tx = await bundlr.upload(serialized, {
			tags: [{ name: "Content-Type", value: "application/json" }],
		});

		console.log(`Upload success content URI= https://arweave.net/${tx.id}`);

		return `https://arweave.net/${tx.id}`;
	} catch (e) {
		console.log("error on upload ", e);
	}
	return "";
};
