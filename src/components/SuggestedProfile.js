import React from "react";

const SuggestedProfile = ({ id, avatarUrl, handle, postUrl }) => {
	return (
		<div className="relative" key={id}>
			<img className="absolute top-0 left-0 h-32 w-full object-cover px-1 py-1" src={postUrl} />

			<div className="h-32 w-full ">
				<div className="pl-2 pt-2 flex flex-row bg-secondary opacity-50  px-1 py-1">
					<img
						className="inline-block h-10 w-10 mb-1 rounded-full ring-2 ring-white"
						src={avatarUrl}
						alt={handle}
					/>
					<h2 className="ml-2 self-center">
						<a className="underline decoration-contast" href={"/" + handle}>
							{handle}
						</a>
					</h2>
				</div>
			</div>
		</div>
	);
};

export default SuggestedProfile;
