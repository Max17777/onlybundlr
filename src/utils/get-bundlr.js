import { WebBundlr } from "@bundlr-network/client";
import { fetchSigner } from "wagmi/actions";

export const getBundlr = async () => {
	const signer = await fetchSigner();
	const provider = signer?.provider;

	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider, {
		providerUrl: "https://matic-mumbai.chainstacklabs.com",
	});

	await bundlr.ready();
	return bundlr;
};
