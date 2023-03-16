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
	console.log("feed=", feed);

	return (
		<div className="flex flex-col w-3/6 bg-background w-full px-5">
			<div className="w-full px-5 py-2 bg-primary rounded-xl mb-2 mt-2">
				<label className="block uppercase  text-xl font-bold text-center">
					{activeProfile?.handle}
				</label>
			</div>
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{isConnected && (
				<div>
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
