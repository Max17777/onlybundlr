import React, { useState, useEffect } from "react";
import Post from "./Post";

const ContentFeed = () => {
	const [loggedIn, setLoggedIn] = useState(false);

	const [posts, setPosts] = useState([
		{
			avatarUrl: "/img/profiles/profile1.png",
			postUrl: "/img/posts/post5.png",
			handle: "llamalove.lens",
		},
		{
			avatarUrl: "/img/profiles/profile2.png",
			postUrl: "/img/posts/post2.png",
			handle: "justsayllama.lens",
		},
		{
			avatarUrl: "/img/profiles/profile3.png",
			postUrl: "/img/posts/post3.png",
			handle: "yesllama.lens",
		},
		{
			avatarUrl: "/img/profiles/profile4.png",
			postUrl: "/img/posts/post4.png",
			handle: "allaboutthellamas.lens",
		},
		{
			avatarUrl: "/img/profiles/profile5.png",
			postUrl: "/img/posts/post1.png",
			handle: "lalalallllama.lens",
		},
	]);

	return (
		<div className="flex flex-col w-3/6 bg-background w-full">
			{!loggedIn && (
				<button
					className="mt-20 object-center self-center  font-main w-40 py-2 px-5 text-white rounded-lg bg-primary hover:bg-secondary "
					onClick={() => setLoggedIn(true)}
				>
					login with lens
				</button>
			)}
			{loggedIn && (
				<div>
					{posts.map((post, id) => {
						return (
							<Post
								id={id}
								avatarUrl={post.avatarUrl}
								postUrl={post.postUrl}
								handle={post.handle}
								postOnly={false}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ContentFeed;
