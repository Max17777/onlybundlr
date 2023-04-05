import React from "react";
import {
	useFollow,
	useUnfollow,
	useApproveModule,
	FollowPolicyType,
	Amount,
	TokenAllowanceLimit,
} from "@lens-protocol/react";

function FollowButton({ followee, follower }) {
	console.log("FollowButton followee=", followee);
	console.log("FollowButton follower", follower);

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
	const { execute: approve, error, isPending } = useApproveModule();

	const approveAndFollow = async () => {
		if (followee.followPolicy?.type === FollowPolicyType.CHARGE) {
			await approve({
				amount: followee.followPolicy.amount,
				spender: "0xe7AB9BA11b97EAC820DbCc861869092b52B65C06",
				// spender is the contract address you want to authorize to access ERC20
				// in your wallet. In this case the follow module contract address is the spender.
				limit: TokenAllowanceLimit.EXACT,
			});
		}
		console.log("executing follow");
		await follow();
	};

	if (followee.followStatus === null) {
		return null;
	}

	console.log("FOLLOWBUTTOn followee.followStatus.isFollowedByMe=", followee.followStatus.isFollowedByMe);
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
				onClick={approveAndFollow}
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
