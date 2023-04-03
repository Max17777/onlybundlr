import React from "react";
import { useAccount } from "wagmi";
import { useActiveProfile } from "@lens-protocol/react";
import EditProfileDetails from "../components/EditProfileDetails";
import EditProfilePicture from "../components/EditProfilePicture";
import LoginButton from "../components/LoginButton";
import ProfileSwitcher from "../components/ProfileSwitcher";
import BundlrBalance from "../components/BundlrBalance";

const EditProfile = () => {
	const { isConnected } = useAccount();
	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
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
