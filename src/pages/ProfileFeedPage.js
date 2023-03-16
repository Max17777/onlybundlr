import React, { useState, useEffect } from "react";
import { usePublications, useProfile, useActiveProfile } from "@lens-protocol/react";
import FollowButton from "../components/FollowButton";
import PublicationFeed from "../components/PublicationFeed";

const ProfileFeed = () => {
	const [profilePicture, setProfilePicture] = useState("");
	const [coverPicture, setCoverPicture] = useState("");
	const [followPrice, setFollowPrice] = useState(10); // todo figure this out later
	const [currentHandle, setCurrentHandle] = useState("");

	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
	const { data: profile, loading: profileLoading } = useProfile({ handle: currentHandle });

	const [following, setFollowing] = useState(false);

	useEffect(() => {
		// Update the document title using the browser API
		setCurrentHandle(window.location.href);

		// grab just the user's handle, the final part of the URL
		// regex from Professor ChatGPT
		const regex = /[^/]*$/;
		setCurrentHandle(window.location.href.match(regex)[0]);
	});

	useEffect(() => {
		if (profile) {
			let profilePictureURL = profile.picture?.original.url;
			let coverPictureURL = profile.coverPicture?.original.url;

			if (profilePictureURL && profilePictureURL.indexOf("ipfs://") !== -1) {
				profilePictureURL = profilePictureURL.replace("ipfs://", "https://ipfs.io/ipfs/");
			}
			if (coverPictureURL && coverPictureURL.indexOf("ipfs://") !== -1) {
				coverPictureURL = coverPictureURL.replace("ipfs://", "https://ipfs.io/ipfs/");
			}
			setProfilePicture(profilePictureURL);
			setCoverPicture(coverPictureURL);
			setFollowing(profile.__isFollowedByMe);
		}
	}, [profile]);

	return (
		<div className="w-3/6 bg-background">
			<div className="sticky top-0 relative bg-primary border border-2 border-secondary px-2 h-62 mt-5">
				<h1 className="font-main">{profile?.handle}</h1>
				<p className="font-main text-sm">
					{profile?.stats.totalPublications} Posts * {profile?.stats.totalCollects} Likes *{" "}
					{profile?.stats.totalFollowers} Followers
				</p>
				<img className="z-0 h-32 w-full object-cover" src={coverPicture} alt="header" />
				<img
					className="absolute top-40 z-10 h-15 w-12 rounded-full border-2 border-white "
					src={profilePicture}
					alt={currentHandle}
				/>

				{!activeProfileLoading && !profileLoading && profile?.id !== activeProfile?.id && (
					<div className="flex flex-row justify-end mt-2">
						<FollowButton followee={profile} follower={activeProfile} />
					</div>
				)}

				<h1 className="font-main text-sm mt-2 bg-secondary px-2 py-2">{profile?.bio}</h1>
			</div>
			{!profileLoading && <PublicationFeed profile={profile} />}
		</div>
	);
};

export default ProfileFeed;
