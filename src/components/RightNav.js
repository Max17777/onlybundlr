import React, { useState, useEffect } from "react";
import SuggestedProfile from "../components/SuggestedProfile";
import { useExploreProfiles } from "@lens-protocol/react";

import { SiSpringCreators } from "react-icons/si";

const RightNav = () => {
	const [suggestions, setSuggestions] = useState([]);
	// const { data, loading, hasMore, next } = useProfilesToFollow({ limit: 5 });
	const { data: profiles, loading, hasMore, next } = useExploreProfiles({ limit: 10 });
	const [suggestedProfileHandles, setSuggestedProfileHandles] = useState([]);

	useEffect(() => {
		const profiles = [
			"llamakahlo.test",
			"llamaanime.test",
			"llamablackandwhite.test",
			"llamafigurine.test",
			"llamabasquiat.test",
		];
		// shuffle the order
		for (let i = profiles.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[profiles[i], profiles[j]] = [profiles[j], profiles[i]];
		}
		// pick just 4
		setSuggestedProfileHandles(profiles.slice(0, 4));
	}, []);

	return (
		<div className="w-3/6 h-screen sticky top-0 pt-5 bg-background px-4">
			<div className="flex flex-row justify-center font-logo text-6xl mb-3">
				<SiSpringCreators /> OnlyBundlr
			</div>
			<h1 className="font-main bg-primary rounded-xl pl-1">Suggested Profiles</h1>
			<div className="flex flex-col">
				{suggestedProfileHandles.map((suggestedProfileHandle, id) => {
					return <SuggestedProfile key={id} handle={suggestedProfileHandle} />;
				})}
			</div>
		</div>
	);
};

export default RightNav;
