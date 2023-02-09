import React, { useState, useEffect } from "react";
import SuggestedProfile from "../components/SuggestedProfile";

const RightNav = () => {
	const numPosts = 5;
	const [suggestions, setSuggestions] = useState([
		{
			avatarUrl: "/img/profiles/profile6.png",
			postUrl: "/img/posts/post6.png",
			handle: "llamapaloza.lens",
		},
		{
			avatarUrl: "/img/profiles/profile7.png",
			postUrl: "/img/posts/post7.png",
			handle: "lotsofllamas.lens",
		},
		{
			avatarUrl: "/img/profiles/profile8.png",
			postUrl: "/img/posts/post8.png",
			handle: "llamaland.lens",
		},
	]);

	return (
		<div className="w-2/6 h-screen sticky top-0 pl-2 pt-5 bg-background">
			<h1 className="font-main bg-primary">Suggested Profiles</h1>
			<div className="flex flex-col">
				{suggestions.map((post, id) => {
					return (
						<SuggestedProfile
							id={id}
							avatarUrl={post.avatarUrl}
							postUrl={post.postUrl}
							handle={post.handle}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default RightNav;
