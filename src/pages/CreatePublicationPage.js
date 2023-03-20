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
			{!activeProfile && (
				<div className="object-center self-center mt-[5%] text-xl ml-5">
					you don't have an active profile, please{" "}
					<a href="/edit-profile" className="underline">
						create one
					</a>
				</div>
			)}
			{isConnected && !profileLoading && activeProfile && (
				<PublicationComposer publisher={activeProfile} />
			)}
		</div>
	);
};

export default CreatePublication;
