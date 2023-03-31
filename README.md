# Bundlr Lens Quest
Welcome to the second Bundlr developer quest! In our first quest, we introduced you to our [SDK and each of its functions.](https://docs.bundlr.network/tutorials/bundlr-nodejs) Everyone who completed it learned all the skills needed to build a dApp using Bundlr, and earned a [beautiful interactive music NFT](https://opensea.io/assets/matic/0x1c8f5f29d1498474844d6a5160b640c674276dba/0).

For our second developer quest, we're going bigger ... much bigger, and we're building a full social network dApp using Lens Protocol.

Lens Protocol is a permissionless, composable, and decentralized social graph that makes building Web3 social apps easy. In simple language, they handle all the infrastructure and plumbing needed to build a social network, which frees us builders up to focus on building the business logic unique to our community. 

Bundlr is a permissionless, composable, and decentralized data layer that makes permanently storing data very easy. In simple language, we handle all the infrastructure and plumbing needed to store images and posts forever, which frees up builders to focus on building the business logic unique to their community. 

A long, long time ago ... way back in the dark days of web2, if you wanted to build a new social network, you'd probably start by designing a database capable of holding your data. From there, you'd look at how to scale the database to handle millions of transactions per second, then you'd look at building data centers around the world that could withstand natural disasters. Finally, after months of work and millions of VC dollars, you'd build your user interface and start testing your app. 

Things are different now.

When building on Lens+Bundlr, you start with a highly scalable infrastructure, then on top of that, you can rapidly build a social application. All the plumbing is there, you only need to build the user interface your community needs. What's cool about having these tools in place is they make building community-specific social networks easy. Building the next Twitter or Facebook will take more than just amazing technology, it will take a massive marketing budget and probably a fair amount of luck too. But there's room for other social apps, especially smaller, community-focused ones. You could build a social app for lovers of vegan food, book lovers, digital nomads, or people who practice yoga.


## OnlyBundlr

In this developer quest, we'll build OnlyBundlr, a web3 social app for the creator economy. Inspired by wildly successful platforms like OnlyFans and Patreon, we'll build a social network where creators can create a profile and set a fee required to follow them. Creators can post text and images to their feed, which only paid followers can view. For people following creators, we'll present a curated feed showing posts from people they pay to follow only. 

Finally, we'll show how Lens+Bundlr puts creators in control of their data. We'll show how the profile you build, including your content and followers, is totally portable. A creator could easily build up a large profile on OnlyBundlr, and then take that profile and move it elsewhere. Creators building on Lens+Bundlr are never at risk of being de-platformed, or even of suffering when a social network goes out of business. As Lens is built on top of smart contracts on the Polygon blockchain, and leverages Bundlr's Data Availability layer built on Arweave, your data is guaranteed to be there forever. As both Polygon and Arweave are decentralized, your data is also censorship resistant. 

The focus of this developer quest is on learning how to use Bundlr and Lens, we'll assume you already have a working understanding of JavaScript, React, and Tailwind. In the GitHub repository for this project, you can clone a branch that has the UI fully built out already. That way you can focus on building out business logic using the Lens and Bundlr SDKs.

I like building projects that look cool, I want to be inspired by the UI. To give this project an extra bit of flair, I used Stable Diffusion to create images in the style of some of my favorite artists. Each sample profile is based on a different artist.  

And when you're done building this project, we'll gift you a free-mint NFT to celebrate your achievement. 

### How Bundlr Works

Storing data permanently on Bundlr is a four step process that can be done from any JavaScript / TypeScript application:

1. Connect to a Bundlr node
2. Fund that node [(using any of the many tokens we support)](https://docs.bundlr.network/sdk/using-other-currencies)
3. Upload your data (binary data, file, or folder)
4. Get back a transaction id you can use to download the data instantly

Once your data is uploaded to a Bundlr node, we ensure it gets finalized on Arweave. As a developer, you don't need to ensure th

### Step 1: Connect To A Bundlr Node
Nodes are the main access point when working with Bundlr, we have three node addresses. Two production nodes where you pay for uploads using any of the 14 tokens we support:

- `https://node1.bundlr.network`
- `https://node2.bundlr.network`

And a Devnet node where you pay for uploads using free tokens available from faucets:

- `https://devnet.bundlr.network`

When connecting to a node, you pass the URL of the node, along with the currency you'll use to pay and a reference to injected provider connecting to an end-user's wallet.

```js
	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider);
```

### Step 2: Fund A Node
To fund a node, you call an async function on your WebBundlr object and pass in the amount you want to fund in atomic units. You can either use lazy-funding where you fund the exact amount required to pay for that upload or up-front funding, where you fund a large amount in advance and then slowly use that balance. [Excess balances can always be withdrawn if no longer needed.](https://docs.bundlr.network/sdk/basic-features/withdrawing-funds)

```js
await bundlr.fund(fundingAmount);
```

### Step 3: Upload Your Data
You can upload ANYTHING to Bundlr, we provide functions for uploading arbitrary binary data, single files, and entire folders. You can even use the `uploadFolder()` function to upload an entire static website to the permaweb. Uploads can be tagged with metadata, files to be rendered in the browser need to be tagged with the correct `Content-Type` MIME type, also you are welcome to use any other custom metadata your project requires. 

```js
const tx = await bundlr.upload(data, {
	tags: [{ name: "Content-Type", value: fileType }],
});
```

### Step 4: Download Your Data
Calls to `bundlr.upload()` return a JSON object with a transaction id. The transaction id combines with `https://arweave.net` to form a URL you can use to download the file instantly. 

```js
const tx = await bundlr.upload(data, {
	tags: [{ name: "Content-Type", value: fileType }],
});
console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
```

### How Lens Works

Lens provides multiple ways to interact with the protocol, including interacting directly with the smart contracts, using their GraphQL API and using their [React hooks.](https://docs.lens.xyz/docs/sdk-react-intro) The React hooks abstract away much of the complexity of using the lower-level protocol, so that's how we'll do it.

Before we dig into the React hooks, let's take a look at what happens when you create a image post on lens.

![](./LensWorkflow.png)

1. Step 1: Upload your image to Bundlr
2. Step 2: Take the image URL and embed it in structured post metadata. This metadata must follow the standard defined by Lens, and include all required attributes.
3. Step 3: Upload the post metadata to Bundlr
4. Step 4: Send the URL to the post metadata to Lens

Everything on Lens is stored in structured metadata, any mistakes in creating the metadata will mean your post doesn't get indexed. The nice thing about using the React hooks is that you don't need to create the metadata. You call the related hook with the required parameter values, the metadata is generated and then passed to a callback function where you can upload it. Then the result of the callback function is automatically captured and uploaded to Lens. 

But ... more on that in a bit.

## Architecture

## Project Setup

## Bundlr Utility Functions

All of the interactions with Bundlr will be via a set of utility functions accessed by our React components. The first utility function, `getBundlr()` sets up a reference to a `WebBundlr` object and returns it. By abstracting away all of this setup code into a common utility function, we create a single place to store details like the node address and currency used to pay. This way if you want to switch your dApp from the devnet to the mainnet, you only have to adjust parameters in a single place. 


1. `utils/get-bundlr.js`

```js
import { WebBundlr } from "@bundlr-network/client";
import { fetchSigner } from "wagmi/actions";

export const getBundlr = async () => {
	const signer = await fetchSigner();
	const provider = signer?.provider;

	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider);
	await bundlr.ready();
	return bundlr;
};
```

The second utility function accepts an image and a file type, then it checks the price to upload that image, funds that amount and finally uploads the file. This function will cause the browser wallet to popup twice, once to sign the funding transaction and once to sign the upload transaction.

2. `utils\upload-image.js`

```js
import fileReaderStream from "filereader-stream";
import { getBundlr } from "./get-bundlr";

export const uploadImage = async (fileToUpload, fileType) => {
	// get a refernce to the WebBundlr singleton
	const bundlr = await getBundlr();

	try {
		const dataStream = fileReaderStream(fileToUpload);
		const price = await bundlr.getPrice(fileToUpload.size);
		console.log("funding...");
		await bundlr.fund(price);

		const tx = await bundlr.upload(dataStream, {
			tags: [{ name: "Content-Type", value: fileType }],
		});

		console.log(`File uploaded ==> https://arweave.net/${tx.id}`);

		return "https://arweave.net/" + tx.id;
	} catch (e) {
		console.log("error on upload, ", e);
	}
};
```

3. `utils\upload.js`

Our next utility function, `upload()` is similar to `upload-image()` however instead of uploading an image, it uploads a JSON object containing metadata. When working with Lens, all posts, likes, comments, and profile data is structured in a JSON object. That JSON object gets uploaded to Bundlr, and the URL to the metadata is then posted to Lens.

```js
import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";

// called to upload metadata to Bundlr, which is then passed on to Lens
export const upload = async (data) => {
	// set the app id (helps keep our posts from commingling with posts from other apps)
	data.appId = "onlybundlr";

	try {
		const bundlr = await getBundlr();
		const serialized = JSON.stringify(data);

		// get the size in bytes of the data
		const price = await bundlr.getPrice(new Blob([serialized]).size);
		console.log("funding");
		await bundlr.fund(price);

		const tx = await bundlr.upload(serialized, {
			tags: [{ name: "Content-Type", value: "application/json" }],
		});

		console.log(`Upload success content URI= https://arweave.net/${tx.id}`);

		return `https://arweave.net/${tx.id}`;
	} catch (e) {
		console.log("error on upload ", e);
	}
	return "";
};
```

4. `utils\compress-image.js`

Last up is a function to help resize images. When uploading images via Bundlr, you pay per byte, so to help keep costs down, we will resize images before posting them. In the spirit of full transparency, I should admit that ChatGPT wrote this entire function. ChatGPT is an amazing tool, especially when doing one-off tasks you don't normally have to deal with. 


```js
import pica from "pica";

// Written by Professor ChatGPT :)
export const compressImage = async (file, maxSize) => {
	const image = new Image();
	image.src = URL.createObjectURL(file);

	return new Promise((resolve, reject) => {
		image.onload = async () => {
			const canvas = document.createElement("canvas");
			const width = image.width;
			const height = image.height;

			if (width > maxSize || height > maxSize) {
				const scale = Math.min(maxSize / width, maxSize / height);
				canvas.width = width * scale;
				canvas.height = height * scale;
			} else {
				canvas.width = width;
				canvas.height = height;
			}

			const picaInstance = pica();
			const result = await picaInstance.resize(image, canvas);

			result.toBlob(async (blob) => {
				const compressedFile = new File([blob], file.name, {
					type: file.type,
					lastModified: Date.now(),
				});
				resolve(compressedFile);
			}, file.type);
		};

		image.onerror = () => {
			reject(new Error("Failed to load image"));
		};
	});
};
```


## React Hooks

## Profiles

### Active Profiles

### Creating A New Profile

## Publications

### Reading

### Writing

## Data Portability

## Challenges
### UI Challenge
### Encryption Challenge
