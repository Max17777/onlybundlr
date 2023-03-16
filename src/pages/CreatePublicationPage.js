import React, { useState, useEffect } from "react";
import { useActiveProfile } from "@lens-protocol/react";
import PublicationComposer from "../components/PublicationComposer";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import LoginButton from "../components/LoginButton";

const CreatePublication = () => {
	const { data: activeProfile, loading: profileLoading } = useActiveProfile();
	const { isConnected } = useAccount();

	console.log("profileLoading=", profileLoading);
	return (
		<div className="w-3/6 bg-background">
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{isConnected && !profileLoading && <PublicationComposer publisher={activeProfile} />}
		</div>
	);
};

export default CreatePublication;
