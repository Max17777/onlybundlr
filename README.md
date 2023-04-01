# Bundlr Lens Quest
Welcome to the second Bundlr developer quest! In our first quest, we introduced you to our [SDK and each of its functions.](https://docs.bundlr.network/tutorials/bundlr-nodejs) Everyone who completed it learned all the skills needed to build a dApp using Bundlr, and earned a [beautiful interactive music NFT](https://opensea.io/assets/matic/0x1c8f5f29d1498474844d6a5160b640c674276dba/0).

For our second developer quest, we're going bigger ... much bigger, and we're building a full social network dApp using Lens Protocol.

Lens Protocol is a permissionless, composable, and decentralized social graph that makes building Web3 social apps easy. In simple language, they handle all the infrastructure and plumbing needed to build a social network, which frees us builders up to focus on building the business logic unique to our community. 

Bundlr is a permissionless, composable, and decentralized data layer that makes permanently storing data very easy. In simple language, we handle all the infrastructure and plumbing needed to store images and posts forever, which frees up builders to focus on building the business logic unique to their community. 

A long, long time ago ... way back in the dark days of web2, if you wanted to build a new social network, you'd probably start by designing a database capable of holding your data. From there, you'd look at how to scale the database to handle millions of transactions per second, then you'd look at building data centers around the world that could withstand natural disasters. Finally, after months of work and millions of VC dollars, you'd build your user interface and start testing your app. 

Things are different now.

When building on Lens+Bundlr, you start with a highly scalable infrastructure, then on top of that, you can rapidly build a social application. All the plumbing is there, you only need to build the user interface your community needs. What's cool about having these tools in place is they make building community-specific social networks easy. Building the next Twitter or Facebook will take more than just amazing technology, it will take a massive marketing budget and probably a fair amount of luck too. But there's room for other social apps, especially smaller, community-focused ones. You could build a social app for lovers of vegan food, book lovers, digital nomads, or people who practice yoga.


## OnlyBundlr

### Goals

In this developer quest, we'll build OnlyBundlr, a web3 social app for the creator economy. Inspired by wildly successful platforms like OnlyFans and Patreon, we'll build a social network where creators can create a profile and set a fee required to follow them. Creators can post text and images to their feed, which only paid followers can view. For people following creators, we'll present a curated feed showing posts from people they pay to follow only. 

Finally, we'll show how Lens+Bundlr puts creators in control of their data. We'll show how the profile you build, including your content and followers, is totally portable. A creator could easily build up a large profile on OnlyBundlr, and then take that profile and move it elsewhere. Creators building on Lens+Bundlr are never at risk of being de-platformed, or even of suffering when a social network goes out of business. As Lens is built on top of smart contracts on the Polygon blockchain, and uses Bundlr as a Data Availability layer, your data is guaranteed to be there forever. As both Polygon and Arweave are decentralized, your data is also censorship resistant. 

### Prerequisites

To complete this tutorial, you should already understand [JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/), React, and Tailwind. You don't need to be a UI guru, as I've built a framework template that already has all the UI pieces you need, but you should feel comfortable working with existing UI code. 

This way you get to build something that actually looks like a professional, ready to release dApp, but you only need to foucs on the business logic aspect. Almost like we're all part of a big development team and the the UI team just delivered their work for us to fleshout. 


### Outcomes

There are two levels to this quest, if you want to learn the basics and build a fun project, all you have to do is follow along and complete all the steps I've laid for you. Then, if you want to take things a step further, there are three coding challenges at the end that will help push your skills to the next level. 
  
Finally, when you're done, we'll gift you a free-mint NFT to celebrate your achievement. 

## How Bundlr Works

Storing data permanently on Bundlr is a four-step process that can be done from any JavaScript / TypeScript application:

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

## How Lens Works

Lens provides multiple ways to interact with the protocol, including interacting directly with the smart contracts, using their GraphQL API and using their [React hooks.](https://docs.lens.xyz/docs/sdk-react-intro) The React hooks abstract away much of the complexity of using the lower-level protocol, so that's how we'll do it.

Before we dig into the React hooks, let's take a look at what happens when you create an image post on Lens.

![](./LensWorkflow.png)

1. Step 1: Upload your image to Bundlr
2. Step 2: Take the image URL and embed it in structured post metadata. This metadata must follow the standard defined by Lens, and include all required attributes.
3. Step 3: Upload the post metadata to Bundlr
4. Step 4: Send the URL to the post metadata to Lens

Everything on Lens is stored in structured metadata, any mistakes in creating the metadata will mean your post doesn't get indexed. The nice thing about using the React hooks is that you don't need to create the metadata. You call the related hook with the required parameter values, the metadata is generated and then passed to a callback function where you can upload it. Then the result of the callback function is automatically captured and uploaded to Lens. 

But ... more on that in a bit.

:::note
As I go over each component in the project, I list the React hooks used and link to the related Lens docs. The Lens docs are still a work in progress, and some of the newer hooks aren't yet documented, the only way to learn about them is via Discord or by looking at example code. I call that out in cases where the documentation is not yet ready.
:::

### Profiles, Publications, Follows

If you're going to grok Lens, you need to grok three important concepts first. 

- [Profile](https://docs.lens.xyz/docs/profile): A profile represents a single "user" in the Lens ecosystem. A given wallet can have multiple profiles, only one profile can be active at a given time.
- [Publication](https://docs.lens.xyz/docs/publication): A publication is similar to a "post" on Facebook or Instagram. It's the original content our users will be posting to OnlyBundlr
- [Follow](https://docs.lens.xyz/docs/follow): A follow represents a single user "following" another user. As we're building a dApp to rival OnlyFans and Patreon, we'll build out support for charging people to follow.

Lens also has [comments,](https://docs.lens.xyz/docs/comment) [mirrors,](https://docs.lens.xyz/docs/mirror) and [collects](https://docs.lens.xyz/docs/collect), however to keep this project simple, we're not going to build them. 


### Mainnet vs Testnet

TODO: Graphic showing one wallet having multiple handles, show .test vs .lens extensions

When working with Lens, you need to have a handle, each wallet address can have multiple handles, with exactly one active at a given time. Handle names are immutable, once you pick one you can't change it. 

Lens has both a mainnet and a testnet, the mainnet is where you release production dApps and the testnet is where you work while building your dApp. Mainnet handles are in the format `handle.lens,` and testnet handles are in the format `handle.test`. Currently access to the mainnet is controlled by a whitelist, you need to get added to the whitelist in order to mint a handle. On testnet, anyone can create a handle and build / interact with Lens dApps. 

We will build OnlyBundlr on the testnet.

## Architecture

## Project Setup
(TODO: Update URLS once the project is moved to Bundlr GitHub)

All of the code for this project is contained in a [GitHub repository](https://github.com/lukecd/onlybundlr), there are two branches

- main: Contains the fully-functional project. It is recommended you use this as a reference while building your own project and refer back to it if you get stuck.
- framework: Contains just the UI components, all of the Bundlr and Lens code is removed.

To get started, clone the framework repository using the following commands

```console
git clone -b framework git@github.com:lukecd/onlybundlr.git
cd onlybundlr

```

:::Note
To earn the NFT, you start with the framework project and build the Bundlr and Lens pieces yourself using this tutorial. If you just copy the main branch and submit that, our backend will automatically detect the copy, and your wallet address with be blacklisted. 
:::

## Bundlr Utility Functions

I've abstracted out the Bundlr functionality we'll use for OnlyBundlr into a set of utility functions. If you're going to focus your attention on one part of this quest, definitely take the time to make sure you grok each and every one of these functions. These functions are totally portable and can be copy and pasted into any project needing permanent storage. 

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

2. `utils/get-balance-matic.js`

Our Edit Profile UI has an option to fund a Bundlr node to pay for uploads, this utility function will be called to get the current funded balance. Note that node balances are recorded in atomic units, a number format that increases accuracy when doing floating point math in JavaScript. To make things easier to understand, this function converts the atomic balance into an easy-to-read format before returning it.


```js
import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";

// gets the loaded balance in MATIC, not atomic units
export const getBalanceMatic = async () => {
	try {
		const bundlr = await getBundlr();
		const atomicBalance = await bundlr.getLoadedBalance();
		console.log("got atomicBalance=", atomicBalance);
		return bundlr.utils.unitConverter(atomicBalance).toString();
	} catch (e) {
		console.log("error on upload ", e);
	}
	return "";
};
```

3. `utils/fund-node.js`

As a pair to the previous function, this function will also be called from our Edit Profile UI to increase the amount funded on the current node. 

```js
import { WebBundlr } from "@bundlr-network/client";
import { getBundlr } from "./get-bundlr";
import BigNumber from "bignumber.js";

// takes the specified amount, converts to atomic units and funds the node
export const fundNode = async (fundAmount) => {
	try {
		const bundlr = await getBundlr();
		const fundAmountParsed = new BigNumber(fundAmount).multipliedBy(bundlr.currencyConfig.base[1]);

		const tx = await bundlr.fund(fundAmountParsed);
		return "Node funded";
	} catch (e) {
		console.log("error on upload ", e);
		return "Error on fund: " + e;
	}
	return "";
};
```

The second utility function accepts an image and a file type, then it checks the price to upload that image, checks the current node balance, adds additional funds if needed, finally uploads the file. This function will cause the browser wallet to popup twice, once to sign the funding transaction and once to sign the upload transaction.

2. `utils/upload-image.js`

```js
import fileReaderStream from "filereader-stream";
import { getBundlr } from "./get-bundlr";

export const uploadImage = async (fileToUpload, fileType) => {
	// get a refernce to the WebBundlr singleton
	const bundlr = await getBundlr();

	try {
		const dataStream = fileReaderStream(fileToUpload);
		const price = await bundlr.getPrice(fileToUpload.size);
		const balance = await bundlr.getLoadedBalance();

		// only fund if needed
		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("funding");
			await bundlr.fund(price);
		} else {
			console.log("funding not needed, balance sufficient");
		}

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

		// only fund if needed
		const price = await bundlr.getPrice(new Blob([serialized]).size);
		const balance = await bundlr.getLoadedBalance();

		if (price.isGreaterThanOrEqualTo(balance)) {
			console.log("funding");
			await bundlr.fund(price);
		} else {
			console.log("funding not needed, balance sufficient");
		}

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

## App.js

Lens works in conjunction with the [WAGMI](https://wagmi.sh/) hooks for React which abstract out low-level wallet interactions. Both Lens and WAGMI use the React provider pattern, where setup happens in your top-most file (`App.js` or `index.js`), and then is made available to child components by wrapping those child components in a provider tag set.

Let's first take a look at how we're setting up Lens. Pretty much everything here is boilerplate, two things to pay attention to are the environment and sources parameters. The first `environment` is where we specify we're on the testnet and not the mainnet and then `sources` is where we specify our unique application id. By setting a unique application id here, we make sure that feed posts are limited to ones created by OnlyBundlr. If we left it out, we would end up showing a feed that pulled data from other apps too.

:::note
The use of the application id is a great example of how data is portable in Lens. I could easily change that application id to that of an existing commercial Lens application and build a new UI. This opens up new ways to compete and innovate, anyone with an idea for a UI can build that and leverage existing data. 
:::

```js
const lensConfig = {
	bindings: wagmiBindings(),
	environment: staging,
	sources: ["onlybundlr"],
	storage: localStorage(),
};
```

```js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { staging, LensProvider } from "@lens-protocol/react";
import { localStorage } from "@lens-protocol/react/web";

import LeftNav from "./components/LeftNav";
import RightNav from "./components/RightNav";
import ContentFeedPage from "./pages/ContentFeedPage";
import ProfileFeedPage from "./pages/ProfileFeedPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreatePublicationPage from "./pages/CreatePublicationPage";

import CreateProfile from "./components/CreateProfile";

const { chains, provider, webSocketProvider } = configureChains([polygonMumbai], [publicProvider()]);
const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});

const lensConfig = {
	bindings: wagmiBindings(),
	environment: staging,
	sources: ["onlybundlr"],
	storage: localStorage(),
};

function App() {
	return (
		<WagmiConfig client={client}>
			<LensProvider config={lensConfig}>
				<div className="flex flex-row">
					<LeftNav />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<ContentFeedPage />} />
							<Route path="/home" element={<ContentFeedPage />} />
							<Route path="/*" element={<ProfileFeedPage />} />
							<Route path="/create-profile" element={<CreateProfile />} />
							<Route path="/edit-profile" element={<EditProfilePage />} />
							<Route path="/create-publication" element={<CreatePublicationPage />} />
						</Routes>
					</BrowserRouter>
					<RightNav />
				</div>
			</LensProvider>
		</WagmiConfig>
	);
}

export default App;
```

## Profiles

When working with Lens, each wallet address can have an infinite number of profiles. Each profile can have its own follow settings, either allowing anyone to follow or charging for a follow. Since we're building an dApp to rival OnlyFans or Patreon, we will implement the charge functionality. When setting up your profile, you can specify a fee to follow (in WMATIC, WETH, USDC, DAI, NCT) and then people who follow you will have to pay when executing the follow. 

We'll "follower-gate" profiles by making posts available only to followers.

### LoginButton
React Hooks Used
- [`useWalletLogin`](https://docs.lens.xyz/docs/use-wallet-login)

In order to interact with Lens, you need to login first. This involves a simple wallet interaction where MetaMask will pop up and ask you to sign a message. There's no cost or gas fees to execute.

We will wrap various components of our app with a check to see if the user is logged in and then show the login button if not. By abstracting much of the login logic into this component, we make it easy to put the button anywhere. 

I'm going to share a little secret with you, modern software development is about half actual coding and half copy and pasting. Who knows, in the ChatGPT era, we might even get to the point where copy and pasting is more than 50%. When you're learning to code, it's important to really grok the basics, but when you're working in a paid job, all that matters is you release working code as quickly as possible. Code when you have to, but copy and paste from documentation and tutorials when you can. 

The [code below is mostly from the Lens docs,](https://docs.lens.xyz/docs/use-wallet-login) I just pasted it here and added my own custom styling. 

```
import { useWalletLogin } from "@lens-protocol/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const LoginButton = () => {
	const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

	const { isConnected } = useAccount();
	const { disconnectAsync } = useDisconnect();

	const { connectAsync } = useConnect({
		connector: new InjectedConnector(),
	});

	const onLoginClick = async () => {
		if (isConnected) {
			await disconnectAsync();
		}

		const { connector } = await connectAsync();
		if (connector instanceof InjectedConnector) {
			const signer = await connector.getSigner();
			await login(signer);
		}
	};

	return (
		<div>
			{loginError && <p>{loginError}</p>}
			<button
				className="font-main ml-2 px-5 text-white rounded-lg bg-primary hover:bg-secondary "
				disabled={isLoginPending}
				onClick={onLoginClick}
			>
				Log in
			</button>
		</div>
	);
};

export default LoginButton;
```

### ProfileSwitcher
React Hooks Used

- [`useProfilesOwnedByMe`](https://docs.lens.xyz/docs/use-profiles-owned-by-me)
- [`useActiveProfile`](https://docs.lens.xyz/docs/use-active-profile)
- `useActiveProfileSwitch` (Not currently documented)
- [`useCreateProfile`](https://docs.lens.xyz/docs/use-create-profile)

TODO: Profile switcher UI image
![](./quest-images/profile-switcher.png)

The profile switcher serves two roles. First, in a drop-down menu, it lists all active profiles, allowing you to switch between profiles by changing which is currently active in the UI component. Second, given a "handle name" it lets you create a new handle. A status message is updated to show each step of the process.

:::note
As the main goal of this project is to teach about Bundlr and Lens, I've built out very verbose status messages throughout. Each step of backend interaction is documented in the UI. This would probably be too verbose for a production release, but it helps you as a student really understand each step. Components that need to show status messages do so by setting a React state variable called `message`, which is then shown in the UI. (`const [message, setMessage] = useState("");`)
:::

The Lens React hooks follow a pattern where hooks focused on reading only return a variable called `data` containing the data read. The hooks also return a boolean value `loading` we can use to track if the data has loaded yet. All data is loaded asynchronously, which means it's possible some page elements will load before the data has been returned. To avoid errors, our UI will check the value of the `loading` variable before trying to access the data.

Hooks focused on writing data, expose a variable called `execute`, which is a function pointer we can call later in our code when we want to execute the specific action. 

Since the Lens React hooks all return values with the same name, it's necessary to alias these names when using more than one hook. In JavaScript, we do this with the `:` operator. When this line of code `const { execute, isPending } = useActiveProfileSwitch()` becomes this line `const { execute: switchProfile, isPending } = useActiveProfileSwitch()`, the function pointer previously named `execute` is aliased to `switchProfile`. This is a common pattern we'll use throughout our code. 

Let's look at how we manage existing profiles first. The first hook, `useProfilesOwnedByMe` returns an array listing all profiles owned by the wallet address logged in with the `LoginButton` component we just created. The second hook `useActiveProfile` returns the one profile currently active. These two hooks return a variable named `data` that we alias to `profiles` and `activeProfile`. Each profile consists of an auto-generated unique `id` and a user-supplied unique `handle`.

To swap between existing profiles, we pass the `id` of the desired profile to the `execute` function pointer returned by `useActiveProfileSwitch`. 

```
const { data: profiles, loading: profilesLoading, hasMore, next } = useProfilesOwnedByMe();
const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
const { execute: switchProfile, isPending } = useActiveProfileSwitch();
```	

Let's also take a look at how using the Lens React hooks leads to creating really efficient and easy-to-read code. Below is the HTML for the drop-down containing 

```js {2, 7} showLineNumbers
<select
	onChange={(val) => switchProfile(val.target.value)}
	className="font-main text-s px-5 text-white rounded-lg bg-background hover:bg-secondary ml-2"
	value={activeProfile?.id}
>
	{profiles &&
		profiles
			?.filter((a, i) => profiles?.findIndex((s) => a.id === s.id) === i)
			.map((profile) => (
				<option key={profile.id} value={profile.id}>
					{profile.handle}
				</option>
			))}
</select>
```


```js
import React, { useState, useEffect } from "react";

import {
	useActiveProfile,
	useCreateProfile,
	useProfilesOwnedByMe,
	useActiveProfileSwitch,
} from "@lens-protocol/react";

const ProfileSwitcher = ({ showCreateNew }) => {
	const [message, setMessage] = useState("");
	const [txActive, setTxActive] = useState(false);
	const [createProfileMode, setCreateProfileMode] = useState(false);
	const [newProfileHandle, setNewProfileHandle] = useState("");
	const { data: profiles, loading: profilesLoading, hasMore, next } = useProfilesOwnedByMe();
	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
	const { execute: switchProfile, isPending } = useActiveProfileSwitch();

	const {
		execute: createNewProfile,
		error: createNewProfileError,
		isPending: createNewProfilePending,
	} = useCreateProfile();

	const doCreateProfile = async () => {
		setMessage("");
		setTxActive(true);
		try {
			console.log("creating profile");
			setMessage("Creating profile ...");
			const tx = await createNewProfile(newProfileHandle);
			setMessage("Profile created.");
			console.log("creating profile tx=", tx);
		} catch (e) {
			setMessage("Error creating profile " + e);
			console.log("error on create profile ", e);
		}
		setTxActive(false);
		setCreateProfileMode(false);
	};

	useEffect(() => {
		console.log("profiles=", profiles);
		if (!profiles || profiles.length === 0) setCreateProfileMode(true);
		else setCreateProfileMode(false);
	}, [profilesLoading]);

	return (
		<div className="w-fit mt-2 flex flex-col bg-primary px-1 py-1 rounded-lg">
			<div className="flex flex-col  w-full">
				<div className="flex flex-row  w-full px-5 py-2 ">
					<label className="font-main block uppercase tracking-wide text-gray-700 text-s font-bold">
						Handle:
					</label>
					{!createProfileMode && (
						<div>
							<select
								onChange={(val) => switchProfile(val.target.value)}
								className="font-main text-s px-5 text-white rounded-lg bg-background hover:bg-secondary ml-2"
								value={activeProfile?.id}
							>
								{profiles &&
									profiles
										?.filter((a, i) => profiles?.findIndex((s) => a.id === s.id) === i)
										.map((profile) => (
											<option key={profile.id} value={profile.id}>
												{profile.handle}
											</option>
										))}
							</select>
							{showCreateNew && (
								<button
									className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
									onClick={() => setCreateProfileMode(true)}
								>
									Create New
								</button>
							)}
						</div>
					)}
					{createProfileMode && (
						<div className="flex flex-row">
							<input
								className="bg-white ml-2 appearance-none block rounded focus:outline-none"
								id="newProfileHandle"
								type="text"
								onChange={(e) => setNewProfileHandle(e.target.value)}
							/>

							<button
								className="ml-10 font-main px-5 text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
								disabled={txActive}
								onClick={doCreateProfile}
							>
								Save New Profile
							</button>
						</div>
					)}
				</div>
				<span className="font-main text-message mr-5 ml-5">{message}</span>
			</div>
		</div>
	);
};

export default ProfileSwitcher;
```



### EditProfilePage

### EditProfileDetails

### EditProfilePicture

### 

## Publications

### Reading

### Writing

## Data Portability

## Challenges
### UI Challenge
### Encryption Challenge
### DIY Challege
