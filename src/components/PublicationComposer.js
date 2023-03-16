import React, { useState, useEffect } from "react";
import { upload } from "../utils/upload";
import { uploadImage } from "../utils/upload-image";
import fileReaderStream from "filereader-stream";
import { fetchSigner } from "wagmi/actions";
import { ContentFocus, CollectPolicyType, ReferencePolicy, useCreatePost } from "@lens-protocol/react";

const PublicationComposer = ({ publisher }) => {
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();
	const [caption, setCaption] = useState("");
	const { execute: create, error, isPending } = useCreatePost({ publisher, upload });

	const handleFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return; // should never happen

		// only accept image/png, image/jpeg
		if (newFiles[0]["type"] !== "image/png" && newFiles[0]["type"] !== "image/jpeg") {
			return;
		}
		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const createPublication = async () => {
		// STEP 1: Upload image
		const imageUrl = "https://arweave.net/nvUPN0LmGwcz0xavoap7Xrj9j1E2X_RGbnae5x_F5Z0"; //await uploadImage(fileToUpload, fileType);

		// STEP 2: Create post
		await create({
			content: caption,
			contentFocus: ContentFocus.TEXT,
			locale: "en",
		});
		// await create({
		// 	profileId: profile.id,
		// 	image: imageUrl,
		// 	imageMimeType: fileType,
		// 	contentFocus: ContentFocus.IMAGE,
		// 	locale: "en",
		// 	collect: {
		// 		type: CollectPolicyType.NO_COLLECT,
		// 	},
		// 	reference: ReferencePolicy.,
		// 	media: [
		// 		{
		// 			url: imageUrl,
		// 			mimeType: fileType,
		// 		},
		// 	],
		// });
	};

	return (
		<div className="mt-5 flex flex-wrap flex-col pb-10">
			<div className=" w-full px-5 py-2 bg-primary rounded-xl mb-2">
				<label className="block uppercase  text-xl font-bold text-center">{publisher.handle}</label>
			</div>
			<div className="bg-primary px-2">
				<label className="block uppercase text-xs font-bold mb-2">
					Choose a photo and click post.
				</label>
				<div className="px-2 py-2 text-sm text-white rounded-lg bg-secondary">
					{fileToUpload && (
						<img src={URL.createObjectURL(fileToUpload)} alt="preview of publication image" />
					)}
					<input
						className={fileToUpload ? "mt-2" : ""}
						type="file"
						onChange={handleFile}
						multiple="single"
						name="files[]"
					/>
				</div>
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Caption
				</label>
				<input
					className="w-full appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="name"
					type="text"
					value={caption || ""}
					onChange={(e) => setCaption(e.target.value)}
				/>

				<div className="flex flex-row justify-end align-start w-full bg-primary pb-2">
					<button
						className="font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
						onClick={createPublication}
					>
						post
					</button>
				</div>
			</div>
		</div>
	);
};

export default PublicationComposer;
