import React from "react";

const Publication = ({ id, content, description, media, publisher }) => {
	console.log("media array=", media);
	return (
		<div
			className="flex flex-col justify-center w-fit bg-primary my-5 bg-slate-300 px-1 py-1 rounded-xl"
			key={id}
		>
			<div className="flex flex-row bg-secondary w-[600px]">
				<img
					className="inline-block h-12 w-12 mb-1 rounded-full ring-2 ring-white"
					src={publisher.picture?.original.url}
					alt={publisher.handle}
				/>
				<h2 className="ml-2 self-center">
					<a className="underline decoration-contast" href={"/" + publisher.handle}>
						{publisher.handle}
					</a>
				</h2>
			</div>
			{media &&
				media.map((picture, id) => {
					return (
						<img
							width="600"
							className="bg-primary px-1 py-1"
							src={picture.original?.url.replace("ipfs://", "https://ipfs.io/ipfs/")}
						/>
					);
				})}
			<h2>{content}</h2>
			<p>{description}</p>
		</div>
	);
};

export default Publication;
