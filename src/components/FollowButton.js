import React from "react";
import { useFollow, useUnfollow } from "@lens-protocol/react";

function FollowButton({ followee, follower }) {
	console.log("followee=", followee);
	console.log("follower=", follower);

	const {
		execute: follow,
		error: followError,
		isPending: isFollowPending,
	} = useFollow({ follower, followee });
	const {
		execute: unfollow,
		error: unfollowError,
		isPending: isUnfollowPending,
	} = useUnfollow({ follower, followee });

	if (followee.followStatus === null) {
		return null;
	}

	if (followee.followStatus.isFollowedByMe) {
		return (
			<>
				<button
					onClick={unfollow}
					disabled={isUnfollowPending || !followee.followStatus.canUnfollow}
					className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
					title={
						!followee.followStatus.canUnfollow
							? "The previous follow request is not finalized on-chain just yet."
							: undefined
					}
				>
					Unfollow
				</button>
				{unfollowError && <p>{unfollowError.message}</p>}
			</>
		);
	}

	return (
		<>
			<button
				onClick={follow}
				disabled={isFollowPending || !followee.followStatus.canFollow}
				className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
				title={
					!followee.followStatus.canFollow
						? "The previous unfollow request is not finalized on-chain just yet."
						: undefined
				}
			>
				Follow
			</button>
			{followError && <p>{followError.message}</p>}
		</>
	);
}

export default FollowButton;
