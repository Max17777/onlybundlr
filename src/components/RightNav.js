import React, { useState, useEffect } from "react";
import SuggestedProfile from "../components/SuggestedProfile";
import { useExploreProfiles } from "@lens-protocol/react";

const RightNav = () => {
	const [suggestions, setSuggestions] = useState([]);
	// const { data, loading, hasMore, next } = useProfilesToFollow({ limit: 5 });
	const { data: profiles, loading, hasMore, next } = useExploreProfiles({ limit: 10 });
	const [suggestedProfileHandles, setSuggestedProfileHandles] = useState([
		"onlyllamas.test",
		"lotsofllamas.test",
		"LlamasInLisbon.test",
	]);

	return (
		<div className="w-2/6 h-screen sticky top-0 pl-2 pt-5 bg-background">
			<h1 className="font-main bg-primary">Suggested Profiles</h1>
			<div className="flex flex-col">
				{suggestedProfileHandles.map((suggestedProfileHandle, id) => {
					return <SuggestedProfile key={id} handle={suggestedProfileHandle} />;
				})}
			</div>
		</div>
	);
};

export default RightNav;
