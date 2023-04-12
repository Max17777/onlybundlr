import { WebBundlr } from "@bundlr-network/client/web";
import { fetchSigner } from "wagmi/actions";
import { ethers } from "ethers";

export const getBundlr = async () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider, {
		providerUrl: "https://rpc-mumbai.maticvigil.com",
	});
	await bundlr.ready();
	return bundlr;
};
