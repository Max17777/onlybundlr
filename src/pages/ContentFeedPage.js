import React, { useState, useEffect } from "react";
import Publication from "../components/Publication";
import {
	useActiveProfile,
	useWalletLogin,
	isValidHandle,
	useCreateProfile,
	useFeed,
} from "@lens-protocol/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import LoginButton from "../components/LoginButton";
import ProfileSwitcher from "../components/ProfileSwitcher";
const ContentFeed = () => {
	const { data: activeProfile, loading: profileLoading } = useActiveProfile();
	const { login, error: loginError, isPending: isLoginPending } = useWalletLogin();
	const { isConnected } = useAccount();
	const { disconnectAsync } = useDisconnect();
	const { connectAsync } = useConnect({
		connector: new InjectedConnector(),
	});

	const {
		data: feed,
		loading,
		hasMore,
		next,
	} = useFeed({
		profileId: activeProfile?.id,
		limit: 10,
	});

	return (
		<div className="flex flex-col w-3/6 bg-background px-5">
			<ProfileSwitcher />
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{isConnected && (
				<div>
					{!activeProfile && (
						<div className="object-center self-center mt-[5%] text-xl ml-5">
							you don't have an active profile, please{" "}
							<a href="/edit-profile" className="underline">
								create one
							</a>
						</div>
					)}
					{!feed ||
						(feed.length === 0 && (
							<div className="object-center self-center mt-[5%] text-xl ml-5">
								your feed appears to be empty, try following more accounts
							</div>
						))}
					{feed &&
						feed.map((publication, id) => {
							return (
								<Publication
									key={publication.root.id}
									content={publication.root.metadata?.content}
									description={publication.root.metadata?.description}
									media={publication.root.metadata?.media}
									publisher={publication.root.profile}
								/>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default ContentFeed;
