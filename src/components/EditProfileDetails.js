import React, { useState, useEffect } from "react";
import { WebBundlr } from "@bundlr-network/client";
import { upload } from "../utils/upload";
import { uploadImage } from "../utils/upload-image";

import fileReaderStream from "filereader-stream";
import { fetchSigner } from "wagmi/actions";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { useUpdateProfileDetails, useUpdateFollowPolicy, FollowPolicyType } from "@lens-protocol/react";

const EditProfileDetails = ({ profile }) => {
	const [message, setMessage] = useState("");
	const [txActive, setTxActive] = useState(false);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("  ");
	const [followFee, setFollowFee] = useState(0);
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();

	const {
		execute: update,
		error: updateError,
		isPending: isUpdatePending,
	} = useUpdateProfileDetails({ profile, upload });

	const {
		execute: updateFollowPolicy,
		isPending: isUpdateFollowPolicyPending,
		error: isUpdateFollowPolicyError,
	} = useUpdateFollowPolicy({ profile });

	const doUpdateProfile = async () => {
		setMessage("");
		setTxActive(true);

		console.log("doUpdateProfile name=", name);
		console.log("doUpdateProfile bio=", bio);
		setMessage("Updating profile information ...");

		let coverPicture = "";
		if (fileToUpload) {
			console.log("uploading cover picture");
			setMessage("Uploading cover picture ...");

			coverPicture = await uploadImage(fileToUpload, fileType);
		} else {
			coverPicture = profile.coverPicture?.original.url || null;
		}
		const attributes = {
			location: "",
			website: "",
		};
		setMessage("Uploading profile information ...");

		await update({ name, bio, coverPicture, attributes });
		setMessage("Profile updated.");
		setTxActive(false);
		//await doUploadFollowPolicy();
	};

	const doUploadFollowPolicy = async () => {
		console.log("updating follow policy followFee=", followFee);
		console.log("updating follow policy profile.ownedBy=", profile.ownedBy);

		await updateFollowPolicy({
			profileId: profile.id,
			amount: { currency: "matic", value: followFee },
			followPolicy: { type: FollowPolicyType.CHARGE },
		});
	};

	useEffect(() => {
		if (profile) {
			setName(profile.name);
			setBio(profile.bio || " ");
		}
	}, [profile]);

	const handleFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const doUpdateCoverPicture = async () => {
		try {
			const coverPicture = await uploadImage(fileToUpload, fileType);

			const attributes = {
				location: "",
				website: "",
			};
			await update(profile.name, profile.bio, coverPicture, attributes);
		} catch (e) {
			console.log("error on update ", e);
		}
	};
	return (
		<div className="w-[600px] mt-2 flex flex-col bg-primary px-1 py-1 rounded-lg">
			<div className="ml-2">
				<label className="font-main block uppercase text-xs font-bold mb-2">
					Personal Information
				</label>
				<label className="font-main block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Name
				</label>
				<input
					className="appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="name"
					type="text"
					size="50"
					value={name || ""}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="w-full ml-2">
				<label className="font-main uppercase">Bio</label>
				<textarea
					className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="bio"
					type="text"
					value={bio || ""}
					onChange={(e) => setBio(e.target.value)}
					rows="10"
					cols="50"
				/>
			</div>

			<div className="w-full ml-2 mt-5">
				<label className="font-main block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Subscription Fee (MATIC)
				</label>
				<input
					className="appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="fee"
					type="text"
					value={followFee}
					onChange={(e) => setFollowFee(e.target.value)}
				/>
			</div>
			<div className="w-full mt-10 flex flex-col  bg-primary px-1 py-1 rounded-lg">
				<label className="font-main block uppercase text-xs font-bold mb-2">Cover Picture</label>
				{profile?.coverPicture && !fileToUpload && (
					<img
						width="600"
						src={profile.coverPicture?.original?.url?.replace(
							"ipfs://",
							"https://ipfs.io/ipfs/",
						)}
						alt="profile_pic"
					/>
				)}
				{fileToUpload && <img src={URL.createObjectURL(fileToUpload)} alt="profile_pic" />}
				<div className="flex flex-row justify-start px-2 py-1 ">
					<input
						type="file"
						onChange={handleFile}
						className="px-2 text-sm text-white rounded-lg w-full"
						multiple="single"
						name="files[]"
					/>
				</div>
			</div>
			<div className="flex flex-row justify-end w-full bg-primary px-2 py-1 mt-1">
				<span className="font-main text-message mr-5">{message}</span>

				<button
					className="font-main px-5 text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
					disabled={txActive}
					onClick={doUpdateProfile}
				>
					save
				</button>
			</div>
		</div>
	);
};

export default EditProfileDetails;
