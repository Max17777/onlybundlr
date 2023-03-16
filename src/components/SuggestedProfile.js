import React, { useState, useEffect } from "react";
import { useProfile } from "@lens-protocol/react";

const SuggestedProfile = ({ handle }) => {
	const { data: profile, loading } = useProfile({ handle });
	const [profilePicture, setProfilePicture] = useState("");
	const [coverPicture, setCoverPicture] = useState("");

	useEffect(() => {
		if (profile) {
			setProfilePicture(profile.picture?.original.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
			setCoverPicture(profile.coverPicture?.original.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
			console.log(profile);
		}
	}, [loading]);

	return (
		<div className="relative" key={profile?.id}>
			{coverPicture && (
				<img
					className="absolute top-0 left-0 h-32 w-full object-cover px-1 py-1"
					src={coverPicture}
				/>
			)}

			<div className="h-32 w-full ">
				<div className="pl-2 pt-2 flex flex-row bg-secondary opacity-50  px-1 py-1">
					{profilePicture && (
						<img
							className="inline-block h-10 w-10 mb-1 rounded-full ring-2 ring-white"
							src={profilePicture}
							alt={handle}
						/>
					)}

					<h2 className="ml-2 self-center">
						<a className="underline decoration-contast" href={"/" + handle}>
							{handle}
						</a>
					</h2>
				</div>
			</div>
		</div>
	);
};

export default SuggestedProfile;
