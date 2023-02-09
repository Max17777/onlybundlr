import React, { useState, useEffect, useRef } from "react";
import { WebBundlr } from "@bundlr-network/client";

import fileReaderStream from "filereader-stream";
import { fetchSigner } from "wagmi/actions";

const EditProfile = () => {
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
					<div className="flex flex-row w-full bg-primary px-5 py-2">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="grid-first-name"
						>
							Handle: lllaaaammmaa.lens
						</label>
					</div>
					<div className="w-full ml-2 mt-5">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="grid-first-name"
						>
							Name
						</label>
						<input
							className="appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							id="grid-first-name"
							type="text"
							placeholder="Llama"
						/>
					</div>
					<div className="w-full ml-2">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="grid-last-name"
						>
							Bio
						</label>
						<textarea
							className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-last-name"
							type="text"
							placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua."
							rows="10"
							cols="50"
						/>
					</div>

					<div className="w-full ml-2 mt-5">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="grid-first-name"
						>
							Subscription Fee
						</label>
						<input
							className="appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							id="grid-first-name"
							type="text"
							placeholder="10 MATIC"
						/>
					</div>
					<div className="flex flex-row w-full bg-primary px-2 py-1 mt-1">
						<button
							className="font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
							onClick={() => uploadImage()}
						>
							save
						</button>
					</div>
					<div className="w-full ml-2 mt-10 flex flex-col">
						<label className="block uppercase text-xs font-bold mb-2" for="grid-last-name">
							Profile Pic
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
					<div className="w-full ml-2 flex flex-col">
						<label className="block uppercase text-xs font-bold mb-2" for="grid-last-name">
							Cover Pic
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
								className="font-main ml-2 px-5 text-white rounded-lg bg-primary hover:bg-secondary"
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

export default EditProfile;
