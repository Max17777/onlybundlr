import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";
import React, { useState, useEffect } from "react";
import Post from "./Post";

const ProfileFeed = () => {
	const [currentHandle, setCurrentHandle] = useState("");
	const [following, setFollowing] = useState(false);

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

	useEffect(() => {
		// Update the document title using the browser API
		console.log(window.location.href);
		setCurrentHandle(window.location.href);
	});

	return (
		<div className="w-3/6 bg-background">
			<div className="relative bg-primary border border-2 border-secondary px-2 h-62 ">
				<h1 className="font-main">Profile Name</h1>
				<p className="font-main text-sm">420 Posts * 1500 Likes</p>
				<img className="z-0 h-32 w-full object-cover" src="/img/posts/post1.png" alt="header" />
				<img
					className="absolute top-40 z-10 h-15 w-12 rounded-full border-2 border-white "
					src="/img/profiles/profile5.png"
					alt={currentHandle}
				/>
				{!following && (
					<div className="flex flex-row justify-end justify-items-end">
						<p className="font-main text-sm self-end">Price: 10 MATIC</p>
						<button
							onClick={() => setFollowing(true)}
							className="ml-2 mt-1 bg-background hover:bg-secondary text-white font-bold py-1 px-4 rounded"
						>
							Subscribe
						</button>
					</div>
				)}
				<h1 className="font-main text-sm mt-2 bg-secondary px-2 py-2">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua.{" "}
				</h1>
			</div>
			{following && (
				<div>
					<div className="mt-10 flex flex-col">
						{posts.map((post, id) => {
							return (
								<Post
									id={id}
									avatarUrl={post.avatarUrl}
									postUrl={post.postUrl}
									handle={post.handle}
									postOnly={true}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileFeed;
