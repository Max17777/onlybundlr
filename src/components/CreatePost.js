import React, { useState, useEffect, useRef } from "react";
import { WebBundlr } from "@bundlr-network/client";

import fileReaderStream from "filereader-stream";
import { fetchSigner } from "wagmi/actions";

const CreatePost = () => {
	const [message, setMessage] = useState("");
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();

	const handleFile = async (e) => {
		setMessage("");
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const uploadImage = async () => {
		console.log("uploadImage called ");

		const signer = await fetchSigner();
		const provider = signer?.provider;

		setMessage("");
		// use method injection to add the missing function
		//provider.getSigner = () => signer; //LUKECD
		// create a WebBundlr object
		const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider, {
			providerUrl: "https://matic-mumbai.chainstacklabs.com",
		});

		await bundlr.ready();

		try {
			const dataStream = fileReaderStream(fileToUpload);
			console.log(dataStream.size);
			const price = await bundlr.getPrice(dataStream.size);
			const balance = await bundlr.getLoadedBalance();
			if (price > balance) {
				setMessage(`Funding Upload ....`);
				await bundlr.fund(price);
			}

			setMessage(`Uploading File To Bundlr ....`);
			const tx = await bundlr.upload(dataStream, {
				tags: [{ name: "Content-Type", value: fileType }],
			});

			console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
			setMessage(`File Uploaded ...`);

			return "https://arweave.net/" + tx.id;
		} catch (e) {
			setMessage("Upload error " + e.message);
			console.log("error on upload, ", e);
		}
	};

	return (
		<div className="w-3/6 bg-background">
			<form className="mt-2">
				<div className="flex flex-wrap flex-col">
					<div className="w-full ml-2 mt-10 flex flex-col">
						<label className="block uppercase text-xs font-bold mb-2" for="grid-last-name">
							Choose a photo and click upload.
						</label>
						<div className="flex flex-row">
							{" "}
							<input
								type="file"
								onChange={handleFile}
								className="px-2 py-2 text-sm text-white rounded-lg  bg-primary"
								multiple="single"
								name="files[]"
							/>
							<button
								className="font-main ml-2 px-5 text-white rounded-lg bg-primary hover:bg-secondary "
								onClick={() => uploadImage()}
							>
								upload
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
