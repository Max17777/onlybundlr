import fileReaderStream from "filereader-stream";
import { getBundlr } from "./get-bundlr";

export const uploadImage = async (fileToUpload, fileType) => {
	// use method injection to add the missing function
	//provider.getSigner = () => signer; //LUKECD
	// create a WebBundlr object
	const bundlr = await getBundlr();
	console.log("uploadImage called bundlr=", bundlr);

	try {
		const dataStream = fileReaderStream(fileToUpload);
		console.log("size", dataStream.size);
		const price = await bundlr.getPrice(Math.floor(dataStream.size * 1.2));
		console.log("funding...");
		await bundlr.fund(price);

		// const balance = await bundlr.getLoadedBalance();
		// console.log("price=", price.toString());
		// console.log("balance=", balance.toString());

		// if (price.multipliedBy(1.2) >= balance) {
		// 	console.log("funding");
		// 	await bundlr.fund(price);
		// }

		const tx = await bundlr.upload(dataStream, {
			tags: [{ name: "Content-Type", value: fileType }],
		});

		console.log(`File uploaded ==> https://arweave.net/${tx.id}`);

		return "https://arweave.net/" + tx.id;
	} catch (e) {
		console.log("error on upload, ", e);
	}
};
