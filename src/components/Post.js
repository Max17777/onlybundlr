import React from "react";

const Post = ({ id, avatarUrl, handle, postUrl, postOnly }) => {
	return (
		<div className="w-full bg-primary my-5 bg-slate-300 px-1 py-1" key={id}>
			{!postOnly && (
				<div className="flex flex-row bg-secondary">
					<img
						className="inline-block h-12 w-12 mb-1 rounded-full ring-2 ring-white"
						src={avatarUrl}
						alt={handle}
					/>
					<h2 className="ml-2 self-center">
						<a className="underline decoration-contast" href={"/handle" + handle}>
							{handle}
						</a>
					</h2>
				</div>
			)}
			<img className="bg-primary px-1 py-1 w-full" src={postUrl} />
		</div>
	);
};

export default Post;
