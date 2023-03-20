import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";

export const upload = async (data) => {
	data.appId = "onlybundlr";

	try {
		const bundlr = await getBundlr();
		console.log("bundlr=", bundlr);
		const serialized = JSON.stringify(data);
		console.log("serialized=", serialized);

		const price = await bundlr.getPrice(new Blob([serialized]).size);
		console.log("funding");
		await bundlr.fund(price);

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
