import React, { useState } from "react";

import { useAccount } from "wagmi";

import {
	useActiveProfile,
	useCreateProfile,
	useProfilesOwnedByMe,
	useActiveProfileSwitch,
} from "@lens-protocol/react";
import EditProfileDetails from "../components/EditProfileDetails";
import EditProfilePicture from "../components/EditProfilePicture";
import LoginButton from "../components/LoginButton";
import ProfileSwitcher from "../components/ProfileSwitcher";
import BundlrBalance from "../components/BundlrBalance";

const EditProfile = () => {
	const { isConnected } = useAccount();
	const [activeProfileId, setActiveProfileId] = useState();
	const [myProfiles, setMyProfiles] = useState([]);

	const [coverPicture, setCoverPicture] = useState("");

	// for images we upload

	const [coverFfileToUpload, setCoverFileToUpload] = useState();
	const [coverFileType, setCoverFileType] = useState();

	const { data: profiles, loading: profilesLoading, hasMore, next } = useProfilesOwnedByMe();
	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();

	const handleCoverFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setCoverFileToUpload(newFiles[0]);
		setCoverFileType(newFiles[0]["type"]);
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
					<ProfileSwitcher showCreateNew={true} />
					<BundlrBalance />

					{activeProfile && (
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
