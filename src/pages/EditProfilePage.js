import React, { useState, useEffect } from "react";
import { WebBundlr } from "@bundlr-network/client";
import { upload } from "../utils/upload";

import fileReaderStream from "filereader-stream";
import { fetchSigner } from "wagmi/actions";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import {
	ContentFocus,
	CollectPolicyType,
	ReferencePolicy,
	useCreatePost,
	useActiveProfile,
	useWalletLogin,
	useCreateProfile,
	useProfilesOwnedByMe,
	useActiveProfileSwitch,
	useUpdateProfileDetails,
	useUpdateProfileImage,
	useUpdateFollowPolicy,
	FollowPolicyType,
} from "@lens-protocol/react";
import EditProfileDetails from "../components/EditProfileDetails";
import EditProfilePicture from "../components/EditProfilePicture";
import EditCoverPicture from "../components/EditCoverPicture";
import LoginButton from "../components/LoginButton";

const EditProfile = () => {
	const [message, setMessage] = useState("");
	const { execute: switchProfile, isPending } = useActiveProfileSwitch();
	const { isConnected } = useAccount();

	const [activeProfileId, setActiveProfileId] = useState();
	const [myProfiles, setMyProfiles] = useState([]);

	const [coverPicture, setCoverPicture] = useState("");
	const [createProfileMode, setCreateProfileMode] = useState(false);
	const [newProfileHandle, setNewProfileHandle] = useState("");

	// for images we upload

	const [coverFfileToUpload, setCoverFileToUpload] = useState();
	const [coverFileType, setCoverFileType] = useState();

	const { data: profiles, loading: profilesLoading, hasMore, next } = useProfilesOwnedByMe();
	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
	const {
		execute: createNewProfile,
		error: createNewProfileError,
		isPending: createNewProfilePending,
	} = useCreateProfile();

	useEffect(() => {
		console.log("profiles=", profiles);
		console.log("profilesLoading=", profilesLoading);
		console.log("activeProfile=", activeProfile);

		if (!profiles || profiles.length === 0) setCreateProfileMode(true);
		else setCreateProfileMode(false);
	}, [profilesLoading]);

	const handleCoverFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setCoverFileToUpload(newFiles[0]);
		setCoverFileType(newFiles[0]["type"]);
	};

	const doCreateProfile = async () => {
		console.log("creating profile");
		const tx = await createNewProfile(newProfileHandle);
		console.log("creating profile tx=", tx);

		setCreateProfileMode(false);
	};

	return (
		<div className="flex flex-col w-3/6 bg-background w-full">
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{isConnected && (
				<div className="flex flex-wrap flex-col">
					<div className="w-full mt-2 flex flex-col bg-primary px-1 py-1 rounded-lg">
						<div className="flex flex-row  w-full px-5 py-2 ">
							<label className="block uppercase tracking-wide text-gray-700 text-s font-bold">
								Handle:
							</label>
							{!createProfileMode && (
								<div>
									<select
										onChange={(val) => switchProfile(val.target.value)}
										className="font-main text-s px-5 text-white rounded-lg bg-background hover:bg-secondary ml-2"
										value={activeProfile?.id}
									>
										{profiles &&
											profiles.map((profile) => (
												<option key={profile.id} value={profile.id}>
													{profile.handle}
												</option>
											))}
									</select>

									<button
										className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
										onClick={() => setCreateProfileMode(true)}
									>
										Create New
									</button>
								</div>
							)}
							{createProfileMode && (
								<div className="flex flex-row">
									<input
										className="bg-white ml-2 appearance-none block rounded focus:outline-none"
										id="newProfileHandle"
										type="text"
										onChange={(e) => setNewProfileHandle(e.target.value)}
									/>

									<button
										className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
										onClick={doCreateProfile}
									>
										Save New Profile
									</button>
								</div>
							)}
						</div>
					</div>
					{!createProfileMode && (
						<>
							{!activeProfileLoading && <EditProfileDetails profile={activeProfile} />}
							{!activeProfileLoading && <EditProfilePicture profile={activeProfile} />}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default EditProfile;
