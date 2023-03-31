import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";

// called to upload metadata to Bundlr, which is then passed on to Lens
export const upload = async (data) => {
	// set the app id (helps keep our posts from commingling with posts from other apps)
	data.appId = "onlybundlr";

	try {
		const bundlr = await getBundlr();
		const serialized = JSON.stringify(data);

		// only fund if needed
		const price = await bundlr.getPrice(new Blob([serialized]).size);
		const balance = await bundlr.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("funding");
			await bundlr.fund(price);
		} else {
			console.log("funding not needed, balance sufficient");
		}

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
