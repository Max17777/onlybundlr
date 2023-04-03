# Bundlr Lens Quest
Welcome to the second Bundlr developer quest! In our first quest, we introduced you to our [SDK and each of its functions.](https://docs.bundlr.network/tutorials/bundlr-nodejs) Everyone who completed it learned all the skills needed to build a dApp using Bundlr, and earned a [beautiful interactive music NFT](https://opensea.io/assets/matic/0x1c8f5f29d1498474844d6a5160b640c674276dba/0).

For our second developer quest, we're going bigger ... much bigger, and we're building a full social network dApp using Lens Protocol.

**Lens Protocol** is a permissionless, composable, and decentralized social graph that makes building Web3 social apps easy. In simple language, they handle all the infrastructure needed to build a social network, which frees us builders up to focus on building the business logic unique to our community. 

**Bundlr** is a permissionless, composable, and decentralized data layer that makes permanently storing data very easy. In simple language, we handle all the infrastructure needed to store images and posts forever, which frees up builders to focus on building the business logic unique to their community. 

A long, long time ago ... way back in the dark days of web2, if you wanted to build a new social network, you'd probably start by designing a database capable of holding your data. From there, you'd look at how to scale the database to handle millions of transactions per second, then you'd look at building data centers around the world that could withstand natural disasters. Finally, after months of work and millions of VC dollars, you'd build your user interface and start testing your app. 

Things are different now.

When building on Lens+Bundlr, you start with a highly scalable infrastructure, then on top of that, you can rapidly build a social application. All the plumbing is there, you only need to build the user interface your community needs. What's cool about having these tools in place is they make building community-specific social networks easy. Building the next Twitter or Facebook will take more than just amazing technology, it will take a massive marketing budget and probably a fair amount of luck. But there's room for other social apps, especially smaller, community-focused ones. You could build a social app for lovers of vegan food, book lovers, digital nomads, or people who practice yoga.


## OnlyBundlr

TODO: OnlyBundlr screenshot or maybe gif

### Goals

In this developer quest, we'll build OnlyBundlr, a web3 social app for the creator economy. Inspired by wildly successful platforms like OnlyFans and Patreon, we'll build a social network where creators can create a profile and set a fee required to follow them. Creators can post text and images to their feed, which only paid followers can view. For people following creators, we'll present a curated feed showing posts from people they pay to follow only. 

Finally, we'll show how Lens+Bundlr puts creators in control of their data. We'll show how the profile you build, including your content and followers, is totally portable. A creator could easily build up a large profile on OnlyBundlr, and then take that profile and move it elsewhere. Creators building on Lens+Bundlr are never at risk of being de-platformed, or even of suffering when a social network goes out of business. As Lens is built on top of smart contracts on the Polygon blockchain, and uses Bundlr as a Data Availability layer, your data is guaranteed to be there forever. As both Polygon and Arweave are decentralized, your data is also censorship resistant. 

### Prerequisites

To complete this tutorial, you should already understand the basics of [JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/), React, and Tailwind. You don't need to be a JavaScript guru either, but you should feel comfortable with concepts like variables, basic primitives, functions and function pointers. You don't need to be a UI guru, as I've built a framework template that already has all the UI pieces you need, but you should feel comfortable working with existing UI code. 

In large development teams, different people build different parts of the application. For this project, imagine that the UI team just turned over their work and left it to you to implement all the backend business logic. 

The last thing you'll need before starting is to have [MetaMask set up](https://www.youtube.com/watch?v=OSRfgDoVQew) and have [funded your wallet with some of MUMBAI MATIC.](https://mumbaifaucet.com/) 


### Outcomes

There are two levels to this quest, if you want to learn the basics and build a fun project, all you have to do is follow along and complete all the steps I've laid for you. Then, if you want to take things a step further, there are three coding challenges at the end that will help push your skills to the next level. 
  
Finally, when you're done, we'll gift you a free-mint NFT to celebrate your achievement. 

## How Bundlr Works

Storing data permanently on Bundlr is a four-step process that can be done from any JavaScript / TypeScript application:

1. Connect to a Bundlr node
2. Fund that node [(using any of the many tokens we support)](https://docs.bundlr.network/sdk/using-other-currencies)
3. Upload your data (binary data, file, or folder)
4. Get back a transaction id you can use to download the data instantly

Once your data is uploaded to a Bundlr node, we ensure it gets finalized on Arweave. It's a simple process where you pay once, and get a guarantee your data will be available forever. 

Let's break it down and look at how to code things.

### Step 1: Connect To A Bundlr Node
Nodes are the main access point when working with Bundlr, we have three node addresses. Two production nodes where you pay for uploads using any of the [14 tokens we support:](https://docs.bundlr.network/sdk/using-other-currencies)

- `https://node1.bundlr.network`
- `https://node2.bundlr.network`

And a Devnet node where you pay for uploads using free tokens available from faucets:

- `https://devnet.bundlr.network`

When connecting to a node, you pass the URL of the node, the currency you'll use to pay, and a reference to injected provider connecting to an end user's wallet. When working in the browser, the class used to access a Bundlr node is called `WebBundlr`.

```js
	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider);
```

### Step 2: Fund A Node
To fund a node, you call an async function on your `WebBundlr` object and pass in the amount you want to fund in atomic units. You can either use lazy-funding where you fund the exact amount required to pay for that upload or up-front funding, where you fund a large amount in advance and then slowly use that balance. [Excess balances can always be withdrawn if no longer needed.](https://docs.bundlr.network/sdk/basic-features/withdrawing-funds)

```js
await bundlr.fund(fundingAmount);
```

### Step 3: Upload Your Data
You can upload ANYTHING to Bundlr, we provide functions for uploading arbitrary binary data, single files, and entire folders. You can even use the `uploadFolder()` function to upload an entire static website to the permaweb. Uploads can be tagged with custom metadata, you are welcome to use any custom name/value pairs your project requires. Files to be rendered in the browser need to be tagged with the correct `Content-Type` MIME type.

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
TODO: Insert Lens Workflow image

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

We'll build OnlyBundlr on the testnet.

### Getting Help

We prepared this quest in both written and video forms to make sure there's something for all learning styles. There are links to outside documentation and lots of side notes that provide additional tips and tricks. If you do get stuck while building, the best way to get help is to hop on over to our [Discord](https://discord.gg/bundlr), or [Telegram](https://t.me/bundlr) I hang out on both every day and am ready to answer any questions you might have. Additionally, you can compare the code you're writing against the main branch of the [GitHub repo](TODO) for this quest.

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

If you clone with `framework` branch and try interacting with the project, you'll notice that it generally loads and some things work while others don't yet work.

Take a moment and look at the code, you'll see multiple places where a function is empty and there's a comment saying, **"QUESTDOOOORS: Complete this"**. This is a note to you that you'll need to code that section yourself using what you've learned here. All the answers are contained in the quest, read everything carefully and you'll be done in about an hour.

:::note
To earn the NFT, start with the framework project and build the Bundlr and Lens pieces yourself using this tutorial. If you just copy the main branch and submit that, our backend will automatically detect the copy, and your wallet address with be blacklisted. 
:::

## Utils, Components, Pages

TODO: Screenshot of VS Code showing project outline

If you look at the layout of files in our framework project, you'll notice three folders `utils`, `components`, and `pages`. We'll start by building out the `utils` section by building a reusable library of Bundlr utility functions. Then we'll build out a library of reusable `components,` and finally, we'll combine those components in different forms to build out our `pages`.


## Bundlr Utility Functions

I've abstracted out the Bundlr functionality we'll use for OnlyBundlr into a set of utility functions. If you're going to focus your attention on one part of this quest, definitely take the time to make sure you grok each and every one of these functions. These functions are totally portable and can be copied and pasted into any project needing permanent storage. 


### Utils: Setting Up WebBundlr

All of the interactions with Bundlr will be via a set of utility functions accessed by our React components. The first utility function, `getBundlr()` sets up a reference to a `WebBundlr` object and returns it. By abstracting away all of this setup code into a common utility function, we create a single place to store details like the node address and currency used to pay. This way if you want to switch your dApp from the devnet to the mainnet, you only have to adjust parameters in a single place. 

File name: `utils/get-bundlr.js`

```js
import { WebBundlr } from "@bundlr-network/client";
import { fetchSigner } from "wagmi/actions";
import { ethers } from "ethers";

export const getBundlr = async () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	console.log("getBundlr signer=", signer);

	const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider, {
		providerUrl: "https://matic-mumbai.chainstacklabs.com",
	});

	await bundlr.ready();
	return bundlr;
};
```

### Utils: Getting Bundlr Node Balance

Our Edit Profile UI has an option to fund a Bundlr node to pay for uploads, this utility function will be called to get the current funded balance. Note that node balances are recorded in atomic units, a number format that increases accuracy when doing floating point math in JavaScript. To make things easier to understand, this function converts the atomic balance into an easy-to-read format before returning it.

File name: `utils/get-balance-matic.js`

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

### Utils: Funding Bundlr Node

As a pair to the previous function, this function will also be called from our Edit Profile UI to increase the amount funded on the current node. 

File name: `utils/fund-node.js`

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


### Utils: Uploading Images

The next utility function accepts an image and a file type, then it checks the price to upload that image, checks the current node balance, adds additional funds if needed, finally uploads the file. This function will cause the browser wallet to popup twice, once to sign the funding transaction and once to sign the upload transaction.


File name: `utils/upload-image.js`

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

### Utils: Uploading Metadata

Our next utility function, `upload()` is similar to `upload-image()` however instead of uploading an image, it uploads a JSON object containing metadata. When working with Lens, all posts, likes, comments, and profile data is structured in a JSON object. That JSON object gets uploaded to Bundlr, and the URL to the metadata is then posted to Lens.

File name: `utils\upload.js`

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

### Utils: Compressing Images

Last up is a function to help resize images. When uploading images via Bundlr, you pay per byte, so to help keep costs down, we will resize images before posting them. In the spirit of full transparency, I should admit that ChatGPT wrote this entire function. ChatGPT is an amazing tool, especially when doing one-off tasks you don't normally have to deal with. 

File name: `utils\compress-image.js`

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

Let's first take a look at how we're setting up Lens. Pretty much everything here is boilerplate, two things to pay attention to are the environment and sources parameters. The first, `environment`, is where we specify we're on the testnet, not the mainnet, and then `sources` is where we specify our unique application id. By setting a unique application id here, we make sure that feed posts are limited to ones created by OnlyBundlr. If we left it out, we would end up showing a feed that pulled data from other apps too.

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

With our Lens configuration set up, we pass it to a `LensProvider` component and then use it to wrap our child components. 

Here's the full code for the component:

File name: `App.js`

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

When working with Lens, each wallet address can have multiple profiles. Each profile can have its own follow settings, either allowing anyone to follow or charging for a follow. Since we're building a dApp to rival OnlyFans or Patreon, we will implement the charge functionality. When setting up your profile, you can specify a fee to follow (using WMATIC, WETH, USDC, DAI, NCT), and then people who follow you will have to pay when executing the follow. 

Finally, we'll "follower-gate" profiles by making posts available only to followers.

### Component: LoginButton

React Hooks Used
- [`useWalletLogin`](https://docs.lens.xyz/docs/use-wallet-login)

In order to interact with Lens, you need to login first. This involves a simple wallet interaction where MetaMask will pop up and ask you to sign a message. There's no cost or gas fees to execute.

We will wrap various components of our app with a check to see if the user is logged in and then show the login button if not. By abstracting much of the login logic into this component, we make it easy to put the button anywhere. 

I'm going to share a little secret with you, modern software development is about half actual coding and half copy and pasting. Who knows, in the ChatGPT era, we might even get to the point where copy and pasting is more than 50%. When you're learning to code, it's important to grok the basics, but when you're working in a paid job, all that matters is you release working code as quickly as possible. Code when you have to, but copy and paste from documentation and tutorials when you can. 

The [code below is mostly from the Lens docs,](https://docs.lens.xyz/docs/use-wallet-login) I just pasted it in and added my own custom styling. 

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

### Component: ProfileSwitcher
React Hooks Used

- [`useProfilesOwnedByMe`](https://docs.lens.xyz/docs/use-profiles-owned-by-me)
- [`useActiveProfile`](https://docs.lens.xyz/docs/use-active-profile)
- `useActiveProfileSwitch` (Not currently documented)
- [`useCreateProfile`](https://docs.lens.xyz/docs/use-create-profile)

TODO: Profile switcher UI screenshot
![](./quest-images/profile-switcher.png)

The profile switcher serves two roles. First, in a drop-down menu, it lists all active profiles, allowing you to switch between profiles by changing which is currently active in the UI component. Second, given a "handle name" it lets you create a new handle. A status message is updated to show each step of the process.

:::note
As the main goal of this project is to teach about Bundlr and Lens, I've used very verbose status messages throughout. Each step of backend interaction is documented in the UI. This would probably be too verbose for a production release, but it helps you as a student really understand each step. Components that need to show status messages do so by setting a React state variable called `message`, which is then shown in the UI. (`const [message, setMessage] = useState("");`)
:::

The Lens React hooks follow a pattern where hooks focused on reading data return a variable called `data` containing the data read. The hooks also return a boolean value `loading` we can use to track if the data has loaded yet. All data is loaded asynchronously, which means it's possible some page elements will load before the data has been returned. To avoid errors, our UI will check the value of the `loading` variable before trying to access the data.

Hooks focused on writing data expose a variable called `execute`, which is a function pointer we can call later in our code when we want to execute the specific action. 

Since the Lens React hooks all return values with the same name, it's necessary to alias these names when using more than one hook. In JavaScript, we do this with the `:` operator. When this line of code `const { execute, isPending } = useActiveProfileSwitch()` becomes this line `const { execute: switchProfile, isPending } = useActiveProfileSwitch()`, the function pointer previously named `execute` is aliased to `switchProfile`. This is a common pattern we'll use throughout our code. 

Let's look at how we manage existing profiles first. The first hook, `useProfilesOwnedByMe` returns an array listing all profiles owned by the wallet address logged in with the `LoginButton` component we just created. The second hook `useActiveProfile` returns the one profile currently active. These two hooks return a variable named `data` that we alias to `profiles` and `activeProfile`. Each profile consists of an auto-generated unique `id` and a user-supplied unique `handle`.

To swap between existing profiles, we pass the `id` of the desired profile to the `execute` function pointer returned by `useActiveProfileSwitch`. 

```
const { data: profiles, loading: profilesLoading, hasMore, next } = useProfilesOwnedByMe();
const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
const { execute: switchProfile, isPending } = useActiveProfileSwitch();
```	

Let's also look at how using the Lens React hooks leads to creating efficient and easy-to-read code. Below is the HTML for the drop-down containing the list of handles owned by the active wallet. On line 2, we create an `onChange` event handler that automatically calls the `switchProfile` function pointer exposed by `useActiveProfileSwitch`. The event handler is automatically called every time the drop-down is updated, meaning the `switchProfile` function will also be called automatically.

Further down on line 7, we iterate over the full list of `profiles` returned by `useProfilesOwnedByMe`, including each in the drop down.

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

Here's the full code for the component:

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

### Component: EditProfileDetails

React hooks used:

- [`useUpdateProfileDetails`](https://docs.lens.xyz/docs/use-update-profile-details)
- `useUpdateFollowPolicy` (Not currently documented)
- [`useCurrencies`](https://docs.lens.xyz/docs/use-currencies)

TODO: Screenshot of edit profile details component

TODO: The code works, but I don't know where to get testnet wETH to pay the fees. I'm chatting with Lens support about this and will update when I do.

In the `EditProfileDetails` component, we set a profile's name, bio, subscription fee, and cover picture. The profile picture is not set here, that will be done in the next component. The reason we separate out the logic like this is due to the way the Lens React hooks are designed, `useUpdateProfileDetails` accepts those parameters, with the profile picture being handled by a different hook. 

You may notice missing from the list of hooks is a hook used to determine the active profile. This is because the active profile will be retrieved at the page level and then passed into the `EditProfileDetails` component. More on that at the end of this section when we combine the components into a single page. 

Let's look at the two hooks used to update profile information. The first `useUpdateProfileDetails`, returns a function pointer we alias to `update` that is called to update that profile, the second, returns a function pointer we alias to `updateFollowPolicy` we use to set the follow policy.

```js
const { execute: update, error: updateError, isPending: isUpdatePending,} = useUpdateProfileDetails({ profile, upload });
const { execute: updateFollowPolicy, isPending: isUpdateFollowPolicyPending, error: isUpdateFollowPolicyError,} = useUpdateFollowPolicy({ profile });
```

When the end-user clicks `save` in the user interface, the `doUpdateProfile` function is called. This function starts out by setting a message to let the end user know we're updating profile information (line 5). Next up, we take the cover image and call our Bundlr utility function `uploadImage` and have it upload that image to Bundlr (line 10). Since we abstracted out this functionality and covered it earlier, we don't need to dig into the details now. Just call the function, let it do its magic, and wait for the result. Finally, we combine the URL to the cover photo with the name and bio entered in the UI and pass them to the `update` function pointer returned by the `useUpdateProfileDetails` React hook (line 20). Then we update the UI to let the user know we've updated the profile (line 21). 

As `useUpdateProfileDetails` works through saving data, something interesting happens that shows the power of designing reusable code. When we set up the reference to the Lens React hook, we pass in the active profile and a pointer to the upload utility function we created in the beginning (`useUpdateProfileDetails({ profile, upload })`). You'll probably remember that this function is passed metadata as a JSON object, it then saves the metadata to Bundlr and returns the URL. This is an important piece of plumbing that holds together a Lens project, and it's one that happens automatically. By creating a reusable utility function, we can now pass it to a variety of Lens React hooks, and the data will automatically be saved. As we work through this quest, you'll notice multiple places where we pass `upload` to a Lens React hook, but since the code is already written and tested, we don't need to cover it each time. 

```js showLineNumbers
const doUpdateProfile = async () => {
	setMessage("");
	setTxActive(true);

	setMessage("Updating profile information ...");

	let coverPicture = "";
	if (fileToUpload) {
		setMessage("Uploading cover picture ...");
		coverPicture = await uploadImage(fileToUpload, fileType);
	} else {
		coverPicture = profile.coverPicture?.original.url || null;
	}
	const attributes = {
		location: "",
		website: "",
	};
	setMessage("Uploading profile information ...");

	await update({ name, bio, coverPicture, attributes });
	setMessage("Profile updated.");
	setTxActive(false);

	// only set the fee if a number greater than 0 is supplied
	if (followFee && followFee > 0) {
		await doUploadFollowPolicy();
	}
};
```

After that, we do something similar to set the follow policy. At this point in the quest, you're probably starting to see the pattern these React hooks follow and the way they simplify development. You really can just read and write data without having to worry about how the underlying metadata or GraphQL are structured. 

```js
// Sets up the follow policy object
function resolveFollowPolicy({ followPolicyType, amount, recipient }) {
	if (followPolicyType === FollowPolicyType.CHARGE) {
		return {
			type: FollowPolicyType.CHARGE,
			amount: amount,
			recipient: recipient,
		};
	}

	return {
		type: FollowPolicyType[followPolicyType],
	};
}
// sets the fee to follow a profile
const doUploadFollowPolicy = async () => {
	const recipient = profile.ownedBy;

	const erc20 = currencies.find((c) => c.symbol === chargeCurrency);
	const fee = Amount.erc20(erc20, followFee);
	await updateFollowPolicy({
		followPolicy: resolveFollowPolicy({
			amount: fee,
			followPolicyType: FollowPolicyType.CHARGE,
			recipient,
		}),
	});
};
```

:::note
When developing it's recommended you leave your follow fee set to 0, this way you can test following without having to have lots of faucet currency to pay follow fees.
:::


Here's the full component code:

```js showLineNumbers
import React, { useState, useEffect } from "react";
import { upload } from "../utils/upload";
import { uploadImage } from "../utils/upload-image";

import {
	Amount,
	useUpdateProfileDetails,
	useUpdateFollowPolicy,
	useCurrencies,
	FollowPolicyType,
} from "@lens-protocol/react";

const EditProfileDetails = ({ profile }) => {
	const [message, setMessage] = useState("");
	const [txActive, setTxActive] = useState(false);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("  ");
	const [followFee, setFollowFee] = useState(0);
	const [chargeCurrency, setChargeCurrency] = useState(0);
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();
	const { data: currencies, error: currenciesError, loading: currenciesLoading } = useCurrencies();

	const {
		execute: update,
		error: updateError,
		isPending: isUpdatePending,
	} = useUpdateProfileDetails({ profile, upload });

	const {
		execute: updateFollowPolicy,
		isPending: isUpdateFollowPolicyPending,
		error: isUpdateFollowPolicyError,
	} = useUpdateFollowPolicy({ profile });

	useEffect(() => {
		if (profile) {
			console.log("active profile ", profile);
			setName(profile.name);
			setBio(profile.bio || " ");

			if (profile.followPolicy?.type === FollowPolicyType.CHARGE) {
				setFollowFee(profile.followPolicy?.amount.value.toString());
			} else {
				setFollowFee(0);
			}
		}
	}, [profile]);

	useEffect(() => {
		// if a follow-fee / currency has yet to be set, pick the first in the list
		if (currencies && !currenciesLoading) {
			if (profile.followPolicy?.type !== FollowPolicyType.CHARGE) {
				setChargeCurrency(currencies[0].symbol);
			} else {
				setChargeCurrency(profile.followPolicy?.amount.asset.symbol);
			}
		}
	}, [currenciesLoading]);

	const doUpdateProfile = async () => {
		setMessage("");
		setTxActive(true);

		setMessage("Updating profile information ...");

		let coverPicture = "";
		if (fileToUpload) {
			setMessage("Uploading cover picture ...");
			coverPicture = await uploadImage(fileToUpload, fileType);
		} else {
			coverPicture = profile.coverPicture?.original.url || null;
		}
		const attributes = {
			location: "",
			website: "",
		};
		setMessage("Uploading profile information ...");

		await update({ name, bio, coverPicture, attributes });
		setMessage("Profile updated.");
		setTxActive(false);

		// only set the fee if a number greater than 0 is supplied
		if (followFee && followFee > 0) {
			await doUploadFollowPolicy();
		}
	};

	// sets the fee to follow a profile
	function resolveFollowPolicy({ followPolicyType, amount, recipient }) {
		if (followPolicyType === FollowPolicyType.CHARGE) {
			return {
				type: FollowPolicyType.CHARGE,
				amount: amount,
				recipient: recipient,
			};
		}

		return {
			type: FollowPolicyType[followPolicyType],
		};
	}
	// sets the fee to follow a profile
	const doUploadFollowPolicy = async () => {
		const recipient = profile.ownedBy;

		const erc20 = currencies.find((c) => c.symbol === chargeCurrency);
		const fee = Amount.erc20(erc20, followFee);
		await updateFollowPolicy({
			followPolicy: resolveFollowPolicy({
				amount: fee,
				followPolicyType: FollowPolicyType.CHARGE,
				recipient,
			}),
		});
	};

	const handleFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const doUpdateCoverPicture = async () => {
		try {
			const coverPicture = await uploadImage(fileToUpload, fileType);

			const attributes = {
				location: "",
				website: "",
			};
			await update(profile.name, profile.bio, coverPicture, attributes);
		} catch (e) {
			console.log("error on update ", e);
		}
	};
	return (
		<div className="w-[600px] mt-2 flex flex-col bg-primary px-1 py-1 rounded-lg">
			<div className="ml-2">
				<label className="font-main block uppercase text-xs font-bold mb-2">
					Personal Information
				</label>
				<label className="font-main block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Name
				</label>
				<input
					className="appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="name"
					type="text"
					size="50"
					value={name || ""}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="w-full ml-2">
				<label className="font-main uppercase">Bio</label>
				<textarea
					className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="bio"
					type="text"
					value={bio || ""}
					onChange={(e) => setBio(e.target.value)}
					rows="10"
					cols="50"
				/>
			</div>

			<div className="w-full ml-2 mt-5">
				<label className="font-main block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Subscription Fee
				</label>
				<div className="flex flex-row">
					<input
						className="appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
						id="fee"
						type="number"
						value={followFee}
						onChange={(e) => setFollowFee(e.target.value)}
					/>
					<select
						name="chargeCurrency"
						className="font-main ml-5 px-5 h-[25px] text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
						defaultValue={
							profile.followPolicy?.type === FollowPolicyType.CHARGE
								? profile.followPolicy.amount.asset.symbol
								: undefined
						}
						onChange={(e) => setChargeCurrency(e.target.value)}
					>
						{currencies &&
							currencies.map((currency) => (
								<option key={currency.symbol} value={currency.symbol}>
									{currency.symbol}
								</option>
							))}
					</select>
				</div>
			</div>
			<div className="w-full mt-10 flex flex-col  bg-primary px-1 py-1 rounded-lg">
				<label className="font-main block uppercase text-xs font-bold mb-2">Cover Picture</label>
				{profile?.coverPicture && !fileToUpload && (
					<img width="600" src={profile.coverPicture?.original?.url} alt="profile_pic" />
				)}
				{fileToUpload && <img src={URL.createObjectURL(fileToUpload)} alt="profile_pic" />}
				<div className="flex flex-row justify-start px-2 py-1 ">
					<input
						type="file"
						onChange={handleFile}
						className="px-2 text-sm text-white rounded-lg w-full"
						multiple="single"
						name="files[]"
					/>
				</div>
			</div>
			<div className="flex flex-row justify-end w-full bg-primary px-2 py-1 mt-1">
				<span className="font-main text-message mr-5">{message}</span>

				<button
					className="font-main px-5 text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
					disabled={txActive}
					onClick={doUpdateProfile}
				>
					save
				</button>
			</div>
		</div>
	);
};

export default EditProfileDetails;
```

### Component: EditProfilePicture

React hooks used:
- [`useUpdateProfileImage`](https://docs.lens.xyz/docs/use-update-profile-image)

TODO: EditProfilePicture UI screenshot

:::note
At this point in the quest, you should grok how to use our utility functions to save data to Bundlr, how to read and write Lens data using the Lens React hooks and how to wire our `upload` function pointer into different React hooks. As we're repeating similar actions with different hooks, we'll assume you know the basics and skip over some of the explanations given earlier. If you are struggling to understand anything so far, I recommend you go back and re-read everything before continuing. 
:::

In `EditProfilePicture` we use the `useUpdateProfileImage` Lens React hook. At setup, we pass in a reference to the active profile and then we're returned a pointer to a function we can call to update the profile image. 

```js
const { execute: updateProfileImage, error: updateProfileImageError, isPending: updateProfileImagePending,} = useUpdateProfileImage({profile,});
```

This function pointer, aliased as `updateProfileImage`, is passed a URL to the new profile image. Then that URL is passed along to the `updateProfileImage` function. Since we already wrote this code and abstracted it way into utility functions, the bulk of the processing in this component can be reduced to two lines of code. Amazing.

```js
const newProfileURL = await uploadImage(fileToUpload, fileType);
await updateProfileImage(newProfileURL);
```

Here's the full code for the component:

```js
import React, { useState } from "react";
import { uploadImage } from "../utils/upload-image";

import { useUpdateProfileImage } from "@lens-protocol/react";

const EditProfilePicture = ({ profile }) => {
	const [message, setMessage] = useState("");
	const [txActive, setTxActive] = useState(false);
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();
	const {
		execute: updateProfileImage,
		error: updateProfileImageError,
		isPending: updateProfileImagePending,
	} = useUpdateProfileImage({
		profile,
	});

	const handleFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const doUpdateProfilePicture = async () => {
		setMessage("");
		setTxActive(true);
		console.log("file: ", fileToUpload);
		if (!fileToUpload) {
			setMessage("Please select an image first");
			setTxActive(false);
			return;
		}

		try {
			setMessage("Uploading image ...");
			const newProfileURL = await uploadImage(fileToUpload, fileType);
			setMessage("Linking image with profile ...");
			await updateProfileImage(newProfileURL);
		} catch (e) {
			console.log("error on update ", e);
		}
		setMessage("Profile image uploded.");
		setTxActive(false);
	};

	return (
		<div className="w-[600px] mt-10 flex flex-col  bg-primary px-1 py-1 rounded-lg mb-10">
			<label className="font-main block uppercase text-xs font-bold mb-2">Profile Picture</label>
			{profile?.picture && !fileToUpload && (
				<img width="600" src={profile.picture?.original.url} alt="profile_pic" />
			)}
			{fileToUpload && <img src={URL.createObjectURL(fileToUpload)} alt="profile_pic" />}
			<div className="flex flex-row justify-start px-2 py-1 ">
				<input
					type="file"
					onChange={handleFile}
					className="px-2 text-sm text-white rounded-lg w-full"
					multiple="single"
					name="files[]"
				/>
				<div className="flex flex-row justify-end align-start w-full bg-primary ">
					<span className="font-main text-message mr-5">{message}</span>

					<button
						className="font-main px-5 text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
						disabled={txActive}
						onClick={() => doUpdateProfilePicture()}
					>
						upload
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditProfilePicture;
```

### Component: BundlrBalance

TODO: Screen capture of the `BundlrBalance` component. 

When working with Bundlr, you pay once, and your uploads are available forever. You can either lazy-fund uploads, where you pay per upload, or up-front fund, where you fund in advance and then slowly use that balance. Funding involves transferring tokens from your wallet to the Bundlr node, which means your wallet (MetaMask) will pop up and have you sign and confirm the transaction. To streamline interactions with OnlyBundlr and reduce the number of wallet popups, [it's recommended you up-front fund around 0.5 MUMBAI MATIC or so.](https://mumbaifaucet.com/) 

The `BundlrBalance` component uses the `getBalanceMatic` utility function to get your current balance, and `fundNode` utility function to add additional funds. 

Let's take a look at the funding function first:

```js
const doFund = async () => {
	if (!fundAmount) {
		setMessage("Please specify an amount to fund");
		return;
	}
	setMessage(`Funding ${fundAmount} MATIC`);
	const fundStatus = await fundNode(fundAmount);
	setMessage(fundStatus);
	setCurBalance(await getBalanceMatic());
	setFundAmount(0);
};
```

The full code for the component is as follows:

```js
import React, { useState, useEffect } from "react";
import { getBalanceMatic } from "../utils/get-balance-matic";
import { fundNode } from "../utils/fund-node";

const BundlrBalance = () => {
	const [curBalance, setCurBalance] = useState(0);
	const [fundAmount, setFundAmount] = useState(0);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchBalance = async () => {
			console.log("getting balance");
			setCurBalance(await getBalanceMatic());
		};
		fetchBalance();
	}, []);

	const doFund = async () => {
		if (!fundAmount) {
			setMessage("Please specify an amount to fund");
			return;
		}
		setMessage(`Funding ${fundAmount} MATIC`);
		const fundStatus = await fundNode(fundAmount);
		setMessage(fundStatus);
		setCurBalance(await getBalanceMatic());
		setFundAmount(0);
	};
	
	return (
		<div className="w-[600px] mt-1 flex flex-col  bg-primary px-1 py-1 rounded-lg ">
			<label className="font-main block uppercase text-xs font-bold mb-2">
				Bundlr Node Balance: {curBalance}
			</label>

			<div className="flex flex-row justify-items-center">
				<label className="font-main block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Amount To Fund
				</label>
				<input
					className="ml-5 appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="fundAmount"
					type="number"
					size="10"
					value={fundAmount || ""}
					onChange={(e) => setFundAmount(e.target.value)}
				/>
				<button
					className="ml-4 font-main px-2 h-7 text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
					onClick={() => doFund()}
				>
					fund
				</button>
			</div>

			<span className="font-main text-message mr-5">{message}</span>
		</div>
	);
};

export default BundlrBalance;
```

### Page: EditProfilePage

React hooks used:

- [`useActiveProfile`](https://docs.lens.xyz/docs/use-active-profile)

TODO: Diagram showing the EditProfilePage page broken down by component

Ok, are you ready to see the magic of componentizing your code? The page `EditProfilePage` starts out by using `useActiveProfile` to get a reference to the active profile, then it builds a page by combining all the components we built earlier into a single page. Where needed, `EditProfilePage` passes a reference to the active profile to its child components.

Here's the full code for the page:

```js
import React from "react";
import { useAccount } from "wagmi";
import { useActiveProfile } from "@lens-protocol/react";
import EditProfileDetails from "../components/EditProfileDetails";
import EditProfilePicture from "../components/EditProfilePicture";
import LoginButton from "../components/LoginButton";
import ProfileSwitcher from "../components/ProfileSwitcher";
import BundlrBalance from "../components/BundlrBalance";

const EditProfile = () => {
	const { isConnected } = useAccount();
	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
	return (
		<div className="flex flex-col w-3/6 bg-background w-full">
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{isConnected && (
				<div className="flex flex-wrap flex-col">
					<ProfileSwitcher showCreateNew={true} />
					<BundlrBalance />

					{activeProfile && (
						<>
							{!activeProfileLoading && <EditProfileDetails profile={activeProfile} />}

							{!activeProfileLoading && <EditProfilePicture profile={activeProfile} />}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default EditProfile;
```

### Component: FollowButton

React hooks used:

- [`useFollow`](https://docs.lens.xyz/docs/use-follow)
- [`useUnfollow`](https://docs.lens.xyz/docs/use-unfollow)
- [`useApproveModule`](https://github.com/lens-protocol/lens-sdk/blob/main/examples/web-wagmi/src/misc/UseApproveModule.tsx)

TODO: screen shot of the follow / unfollow button

TODO: I'm not clear how which faucet to get testnet tokens from in order to test paying. I've got a support ticket open with Lens and will update this when I get an answer

Ok, cool, cool, cool. Now that we can create profiles, we need a way to follow and unfollow profiles. The `FollowButton` component is passed a reference to two profiles (followee, follower). The component checks if `follower` is currently following `followee`, and renders a button that says "unfollow" if currently following and "follow" if not yet following.

In cases where we need to execute a follow, the `useFollow` Lens React hook is called. In cases where we need to execute an unfollow, the `useUnfollow` Lens React hook is called. 

Unfollowing is pretty straightforward, we just call the `unfollow` function pointer and we're done with it. Following is a little more involved as we potentially have to pay a follow fee. In the Lens ecosystem, follow fees can be paid in any one of five different tokens. In order to transfer tokens out of your wallet, you need to give the contract explicit permission to access those tokens first. This is how Web3 wallets work and it's something you probably have experienced if you've worked with AMM swap dApps like Uniswap.

To approve access to tokens with the Lens React hooks, we use the hook `useApproveModule`, which returns a function pointer that we alias to `approve`. When the user clicks "follow" in the UI, instead of immediately calling `folow`, we first check to see if the user has set a follow fee (`FollowPolicyType.CHARGE`), and then we approve access to tokens first.  

When you approve access to tokens, you pass in the exact amount you want to access, the wallet address of the sender, and whether the amount should be exact or not. 

```js
const approveAndFollow = async () => {
	if (followee.followPolicy?.type === FollowPolicyType.CHARGE) {
		await approve({
			amount: followee.followPolicy.amount,
			spender: follower.ownedBy,
			limit: TokenAllowanceLimit.EXACT,
		});
	}
	await follow();
};
```

Here's the full component code:

```js
import React from "react";
import {
	useFollow,
	useUnfollow,
	useApproveModule,
	FollowPolicyType,
	Amount,
	TokenAllowanceLimit,
} from "@lens-protocol/react";

function FollowButton({ followee, follower }) {
	const {
		execute: follow,
		error: followError,
		isPending: isFollowPending,
	} = useFollow({ follower, followee });
	const {
		execute: unfollow,
		error: unfollowError,
		isPending: isUnfollowPending,
	} = useUnfollow({ follower, followee });
	const { execute: approve, error, isPending } = useApproveModule();

	const approveAndFollow = async () => {
		if (followee.followPolicy?.type === FollowPolicyType.CHARGE) {
			await approve({
				amount: followee.followPolicy.amount,
				spender: follower.ownedBy,
				limit: TokenAllowanceLimit.EXACT,
			});
		}
		await follow();
	};

	if (followee.followStatus === null) {
		return null;
	}
	if (followee.followStatus.isFollowedByMe) {
		return (
			<>
				<button
					onClick={unfollow}
					disabled={isUnfollowPending || !followee.followStatus.canUnfollow}
					className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
					title={
						!followee.followStatus.canUnfollow
							? "The previous follow request is not finalized on-chain just yet."
							: undefined
					}
				>
					Unfollow
				</button>
				{unfollowError && <p>{unfollowError.message}</p>}
			</>
		);
	}

	return (
		<>
			<button
				onClick={approveAndFollow}
				disabled={isFollowPending || !followee.followStatus.canFollow}
				className="ml-10 font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
				title={
					!followee.followStatus.canFollow
						? "The previous unfollow request is not finalized on-chain just yet."
						: undefined
				}
			>
				Follow
			</button>
			{followError && <p>{followError.message}</p>}
		</>
	);
}

export default FollowButton;
```

### Component: SuggestedProfile

React hooks used

- [`useProfile`](https://docs.lens.xyz/docs/use-profile) 

TODO: Screenshot of full dApp highlighting right nav

You probably noticed the right side of OnlyBundlr has four suggested profiles for you to follow. This right side is built using first a component called `RightNav` that acts as a parent, it creates a series of `SuggestedProfile` components, one for each profile shown. 

Let's look at `SuggestedProfile` first. The component is passed a handle uniquely identifying a profile, the full profile data is then loaded in using the `useProfile` Lens React hook.

```js
const { data: profile, loading } = useProfile({ handle });
```

Once loaded, we have access to all the data for that profile in the variable aliased as `profile`. From here, it's a simple matter of accessing the profile name, cover picture, and profile picture and building out the HTML. 

```js
import React, { useState, useEffect } from "react";
import { useProfile } from "@lens-protocol/react";

const SuggestedProfile = ({ handle }) => {
	const { data: profile, loading } = useProfile({ handle });
	const [profilePicture, setProfilePicture] = useState("");
	const [coverPicture, setCoverPicture] = useState("");

	useEffect(() => {
		if (profile) {
			setProfilePicture(profile.picture?.original.url);
			setCoverPicture(profile.coverPicture?.original.url);
			console.log(profile);
		}
	}, [loading]);

	return (
		<div className="relative" key={profile?.id}>
			{coverPicture && (
				<img
					className="rounded-lg absolute top-0 left-0 h-32 w-full object-cover px-1 py-1 "
					src={coverPicture}
				/>
			)}

			<div className="h-32 w-full ">
				<div className="mx-2 mt-2 flex flex-row bg-secondary opacity-90 rounded-xl">
					{profilePicture && (
						<img
							className="inline-block h-8 w-8 mb-1 mt-1 ml-1 rounded-full ring-2 ring-white"
							src={profilePicture}
							alt={handle}
						/>
					)}

					<h2 className="ml-2 self-center">
						<a className="font-main underline decoration-contast" href={"/" + handle}>
							{handle}
						</a>
					</h2>
				</div>
			</div>
		</div>
	);
};

export default SuggestedProfile;
```


### Component: RightNav


This is one component that's just pure React, there are no Lens React hooks or Bundlr interactions. I hardcoded a series of five profiles into an array. To make the page a bit more dynamic, I first shuffle the array and then use only the first four items. Each of the four chosen profile handles is passed along to a `SuggestedProfile` component and shown on the page. As you build out this component, try adding the handle of the profile you created!

I also created an OnlyBundlr logo and include that on the right-hand side too. 


```js
import React, { useState, useEffect } from "react";
import SuggestedProfile from "../components/SuggestedProfile";
import { useExploreProfiles } from "@lens-protocol/react";

import { SiSpringCreators } from "react-icons/si";

const RightNav = () => {
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
```


## Publications

Rock-n-roll! If you made it this far, then congratulations are in order. You now understand how to build with Bundlr and how to use the React hooks for Lens. I had you build the profiles section first because it's the hardest. From here on out, everything will be downhill. 

### Component: Publication

TODO: Screenshot of a publication

The `Publication` component renders a single publication (post) to the screen. We'll use it in two places, our main feed showing posts from everyone we subscribe to and in a profile-specific feed showing posts from a given profile. This component is pure React, no Bundlr or Lens integration. The data shown is passed in as variables.

Here's the full code for the component: 

```js
import React from "react";

const Publication = ({ id, content, description, media, publisher }) => {
	console.log("media array=", media);
	return (
		<div
			className="w-[580px] flex flex-col justify-center bg-primary my-5 bg-slate-300 px-1 py-1 rounded-xl"
			key={id}
		>
			<div className="flex flex-row bg-secondary">
				<img
					className="inline-block h-8 w-8 mb-1 mt-1 ml-1 rounded-full ring-2 ring-white"
					src={publisher.picture?.original.url}
					alt={publisher.handle}
				/>
				<h2 className="ml-2 self-center font-main">
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
							className="bg-primary px-1 py-1 rounded-xl"
							src={picture.original?.url}
						/>
					);
				})}
			<h2 className="ml-2 font-main">{content}</h2>
			<p className="ml-2 font-main">{description}</p>
		</div>
	);
};

export default Publication;
```

### Component: PublicationFeed

React hooks used:
- [`usePublications`](https://docs.lens.xyz/docs/use-publications)

The `PublicationFeed` component loads all publications for a given profile and then renders each one as a unique `Publication` component. You'll notice when calling the `usePublications` hook, we pass in a profile id and not a full profile object. This is something to watch out for when using the Lens React hooks as some hooks expect an id, and some expect the full object. 

```js
const { data: publications, error, loading, hasMore } = usePublications({ profileId: profile.id });
```

:::note
To help simplify this quest, I haven't implemented pagination of posts. I just load all of a profile's posts and render them to the screen. Obviously, this would get unwieldy if a profile has hundreds of posts, when you're coding it yourself, try [looking at the documentation](https://docs.lens.xyz/docs/use-publications) and adding pagination in as a bonus feature. 
:::

Here's the full code for the component:

```js
import React from "react";
import Publication from "../components/Publication";
import { usePublications } from "@lens-protocol/react";

const PublicationFeed = ({ profile }) => {
	const { data: publications, error, loading, hasMore } = usePublications({ profileId: profile.id });

	return (
		<div className="flex flex-col">
			{!loading &&
				publications &&
				publications.map((publication) => {
					return (
						<Publication
							key={publication.id}
							content={publication.metadata?.content}
							description={publication.metadata?.description}
							media={publication.metadata?.media}
							publisher={profile}
						/>
					);
				})}
		</div>
	);
};

export default PublicationFeed;
```

### Page: ProfileFeedPage

React hooks used

- [`useProfile`](https://docs.lens.xyz/docs/use-profile) 
- [`useActiveProfile`](https://docs.lens.xyz/docs/use-active-profile) 

The `ProfileFeedPage` shows profile details and a list of publications for a given profile. This page uses a slightly different design from earlier pages. With all our other pages and components, we use React to pass variables between each component. For this page, I wanted to create a page that would allow us to specify a profile name in the URL and then load that data. 

So when working in your local development environment, any of these URLs will load the profile whose handle is in the URL.

- [http://localhost:3000/llamaanime.test](http://localhost:3000/llamaanime.test)
- [http://localhost:3000/llamakahlo.test](http://localhost:3000/llamakahlo.test)
- [http://localhost:3000/llamafigurine.test](http://localhost:3000/llamakahlo.test)
- [http://localhost:3000/llamabasquiat.test](http://localhost:3000/llamakahlo.test)
- [http://localhost:3000/llamablackandwhite.test](http://localhost:3000/llamakahlo.test)

To do this, I use a React `useEffect` hook which is called when the page loads. I use a regex expression to parse our the handle name and set it as a state variable:

```js
useEffect(() => {
		// Update the document title using the browser API
		setCurrentHandle(window.location.href);

		// grab just the user's handle, the final part of the URL
		// regex from Professor ChatGPT
		const regex = /[^/]*$/;
		setCurrentHandle(window.location.href.match(regex)[0]);
	});
```

Then I pass that variable to the `useProfile` React Lens hook, render the profile details and finally pass the profile object to the `ProfileFeed` component we just made. This is another example of the magic of abstraction and componentization. We've built much of this before, here we just combine the components in different ways. 

```js
const { data: profile, loading: profileLoading } = useProfile({ handle: currentHandle });
```

:::note
Want to know another coding secret? Nobody actually remembers how to structure regex phrases, we just look them up when needed or ask ChatGPT to write for us :)
:::

The full page code is here:

```js
import React, { useState, useEffect } from "react";
import { useProfile, useActiveProfile, FollowPolicyType } from "@lens-protocol/react";
import FollowButton from "../components/FollowButton";
import PublicationFeed from "../components/PublicationFeed";

const ProfileFeedPage = () => {
	const [profilePicture, setProfilePicture] = useState("");
	const [coverPicture, setCoverPicture] = useState("");
	const [followFee, setFollowFee] = useState(0);
	const [followCurrency, setFollowCurrency] = useState(0);
	const [currentHandle, setCurrentHandle] = useState("");

	const { data: activeProfile, loading: activeProfileLoading } = useActiveProfile();
	const { data: profile, loading: profileLoading } = useProfile({ handle: currentHandle });

	const [following, setFollowing] = useState(false);

	useEffect(() => {
		// Update the document title using the browser API
		setCurrentHandle(window.location.href);

		// grab just the user's handle, the final part of the URL
		// regex from Professor ChatGPT
		const regex = /[^/]*$/;
		setCurrentHandle(window.location.href.match(regex)[0]);
	});

	useEffect(() => {
		if (profile) {
			let profilePictureURL = profile.picture?.original.url;
			let coverPictureURL = profile.coverPicture?.original.url;

			setProfilePicture(profilePictureURL);
			setCoverPicture(coverPictureURL);
			setFollowing(profile.__isFollowedByMe);

			if (profile.followPolicy?.type === FollowPolicyType.CHARGE) {
				setFollowFee(profile.followPolicy?.amount.value.toString());
				setFollowCurrency(profile.followPolicy?.amount.asset.name);
			} else {
				setFollowFee(0);
			}
		}
	}, [profile]);

	return (
		<div className="w-3/6 bg-background">
			<div className="top-0 relative bg-primary border border-2 border-secondary px-2 h-62 mt-5 w-fit rounded-xl">
				<h1 className="font-main">{profile?.handle}</h1>
				<p className="font-main text-sm">
					{profile?.stats.totalPublications} Posts * {profile?.stats.totalCollects} Likes *{" "}
					{profile?.stats.totalFollowers} Followers
				</p>
				<img className="z-0 h-32 object-cover" width="600" src={coverPicture} alt="header" />
				<img
					className="absolute top-40 z-10 h-15 w-12 rounded-full border-2 border-white "
					src={profilePicture}
					alt={currentHandle}
				/>

				{!activeProfileLoading && !profileLoading && profile?.id !== activeProfile?.id && (
					<div className="flex flex-row justify-end mt-2">
						{followFee === 0 && <span className="font-main">Follow Fee: FREE</span>}
						{followFee !== 0 && (
							<span className="font-main">
								Follow Fee: {followFee} {followCurrency}
							</span>
						)}
						<FollowButton followee={profile} follower={activeProfile} />
					</div>
				)}

				<h1 className="font-main text-sm mt-2 bg-secondary px-2 py-2 mb-1">{profile?.bio}</h1>
			</div>
			{!profileLoading && <PublicationFeed profile={profile} />}
		</div>
	);
};

export default ProfileFeedPage;
```

### Page: ContentFeedPage

React hooks used

- [`useFeed`](https://docs.lens.xyz/docs/use-feed)
- [`useActiveProfile`](https://docs.lens.xyz/docs/use-active-profile)
- [`useWalletLogin`](https://docs.lens.xyz/docs/use-wallet-login)

TODO: Screenshot of the content feed page

Ok, you're so close to finishing.

In the previous page, we built a feed showing a profile and all of its publications. In this page, we'll build a main feed showing posts from ALL profiles you subscribe to. 

This page uses the [`useFeed`](https://docs.lens.xyz/docs/use-feed) Lens React hook which is new to us so far. Remember how a single Lens profile can interact with multiple dApps built on Lens, right? All publications made by a profile are tied back to that profile, which means your OnlyBundlr publications, Lenster publications, and LensTube publications all tie back to the same account. When we set up Lens in our `App.js`, we set an application id in the configuration of "onlybundlr". What's really cool here is the `useFeed` hook automatically picks up that value and generates a feed of only that application id. 

:::note
This, again is where you see the magic of Lens. You could modify this project's code to pull publications from a totally different application. Maybe you want to build a Lens app that pulls data from multiple publications. Or you could redo the UI of an existing Lens dApp to have a new feature only you imagined. Or you could create a UI for an existing Lens dApp with support for your country's spoken language. You're only limited by your creativity, there are no technological roadblocks at all.
:::

Once the feed is loaded, we pull out the data and pass to the `Publication` component we built previously and render the page.

```js
import React from "react";
import Publication from "../components/Publication";
import { useActiveProfile, useWalletLogin, useFeed } from "@lens-protocol/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import LoginButton from "../components/LoginButton";
import ProfileSwitcher from "../components/ProfileSwitcher";
const ContentFeed = () => {
	const { data: activeProfile, loading: profileLoading } = useActiveProfile();
	const { login, error: loginError, isPending: isLoginPending } = useWalletLogin();
	const { isConnected } = useAccount();

	const {
		data: feed,
		loading,
		hasMore,
		next,
	} = useFeed({
		profileId: activeProfile?.id,
		limit: 10,
	});

	return (
		<div className="flex flex-col w-3/6 bg-background px-5">
			<ProfileSwitcher showCreateNew={false} />
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{isConnected && (
				<div>
					{!activeProfile && (
						<div className="font-main object-center self-center mt-[5%] text-xl ml-5">
							you don't have an active profile, please{" "}
							<a href="/edit-profile" className="underline">
								create one
							</a>
						</div>
					)}
					{!feed ||
						(feed.length === 0 && (
							<div className="font-main object-center self-center mt-[5%] text-xl ml-5">
								your feed appears to be empty, try following more accounts
							</div>
						))}
					{feed &&
						feed.map((publication, id) => {
							return (
								<Publication
									key={publication.root.id}
									content={publication.root.metadata?.content}
									description={publication.root.metadata?.description}
									media={publication.root.metadata?.media}
									publisher={publication.root.profile}
								/>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default ContentFeed;
```

### Component: PublicationComposer

React hooks used

-[`useCreatePost`](https://docs.lens.xyz/docs/use-create-post)

TODO: Screenshot of the publication composer

Ok, we can render publications on the screen, how about writing some code so you can create one?

Our OnlyBundlr UI allows for creating text Publications and image publications:

TODO: Screenshot showing text and image pubs

As you can probably guess by now, the workflow is very similar to what you did when creating a new profile. First, you upload the image to Bundlr (using the handy utility function we wrote), then you pass that image's URL to the `execute` function exposed by the `useCreatePost` Lens React hook. That's it. Easy, huh?

The `execute` function is aliased as `create`. Let's look at how we call it first for text Publications, which is a bit simpler. The `content` variable holds the message entered by the user, `contentFocus` tells Lens we're making a text post, `local` sets the natural language used (feel free to change it to match your language!), and then `reference` is where we say this post is only visible to followers. This last part is really important as we want to make sure people can use this to create and monetize their audiences. 

```js
await create({
	content: caption,
	contentFocus: ContentFocus.TEXT,
	locale: "en",
	reference: { type: ReferencePolicyType.FOLLOWERS_ONLY }, // only followers can interact
});
``` 

Creating an image post is a bit more involved as you pass in an additional array of images. In our case, the UI only allows for adding one image, but you could easily modify it to allow for including more. 

```js
await create({
	content: caption,
	contentFocus: ContentFocus.IMAGE,
	locale: "en",
	collect: {
		type: CollectPolicyType.NO_COLLECT,
	},
	reference: { type: ReferencePolicyType.FOLLOWERS_ONLY }, // only followers can interact
	media: [
		{
			url: imageUrl,
			mimeType: fileType,
		},
	],
});
```

Just like when creating posts, we pass our `upload` utility function pointer into the `useCreatePost` hook (`useCreatePost({ publisher, upload })`) when creating it. Again, this gets automatically wired together. The `create` function internally generates the post metadata and passes it to `upload` where it is upload to Bundlr. The URL to the metadata is returned and automatically posted to Lens.

Here's the full code for the component:

```js
import React, { useState, useEffect } from "react";
import { upload } from "../utils/upload";
import { uploadImage } from "../utils/upload-image";
import { ContentFocus, CollectPolicyType, ReferencePolicyType, useCreatePost } from "@lens-protocol/react";
import ProfileSwitcher from "./ProfileSwitcher";

const PublicationComposer = ({ publisher }) => {
	const [message, setMessage] = useState("");
	const [txActive, setTxActive] = useState(false);
	const [fileToUpload, setFileToUpload] = useState(null);
	const [fileType, setFileType] = useState();
	const [caption, setCaption] = useState("");
	const { execute: create, error, isPending } = useCreatePost({ publisher, upload });

	const handleFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return; // should never happen

		// only accept image/png, image/jpeg
		if (newFiles[0]["type"] !== "image/png" && newFiles[0]["type"] !== "image/jpeg") {
			return;
		}
		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const createPublication = async () => {
		setTxActive(true);
		setMessage("");

		if (fileToUpload) {
			// image post
			// STEP 1: Upload image
			setMessage("Uploading image ....");
			const imageUrl = await uploadImage(fileToUpload, fileType);
			// STEP 2: Create post
			setMessage("Creating image publication ....");
			try {
				await create({
					content: caption,
					contentFocus: ContentFocus.IMAGE,
					locale: "en",
					collect: {
						type: CollectPolicyType.NO_COLLECT,
					},
					reference: { type: ReferencePolicyType.FOLLOWERS_ONLY }, // only followers can interact
					media: [
						{
							url: imageUrl,
							mimeType: fileType,
						},
					],
				});
				setCaption("");
				setFileToUpload(null);
				setFileType("");
				setMessage("Publication posted.");
			} catch (e) {
				setMessage("Error on post " + e);
			}
		} else {
			setMessage("Creating text publication ....");
			// text post
			try {
				await create({
					content: caption,
					contentFocus: ContentFocus.TEXT,
					locale: "en",
					reference: { type: ReferencePolicyType.FOLLOWERS_ONLY }, // only followers can interact
				});
				setCaption("");
				setMessage("Publication posted.");
			} catch (e) {
				setMessage("Error on post " + e);
			}
		}
		setTxActive(false);
	};

	return (
		<div className="mt-5 flex flex-wrap flex-col pb-10">
			<ProfileSwitcher showCreateNew={false} />
			<div className="bg-primary px-2 mt-5 rounded-xl">
				<label className="font-main block uppercase text-xs font-bold mb-2">
					Choose a photo and click post.
				</label>
				<div className="px-2 py-2 text-sm text-white rounded-lg bg-secondary">
					{fileToUpload && (
						<img src={URL.createObjectURL(fileToUpload)} alt="preview of publication image" />
					)}
					<input
						className={fileToUpload ? "mt-2" : ""}
						type="file"
						onChange={handleFile}
						multiple="single"
						name="files[]"
					/>
				</div>
				<label className="font-main block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Caption
				</label>
				<input
					className="font-main w-full appearance-none block bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="name"
					type="text"
					value={caption || ""}
					onChange={(e) => setCaption(e.target.value)}
				/>

				<div className="flex flex-row justify-end w-full bg-primary pb-2">
					<span className="font-main text-message mr-5">{message}</span>
					<button
						className="font-main px-5 text-white rounded-lg bg-background enabled:hover:bg-secondary border border-red-500"
						disabled={txActive}
						onClick={createPublication}
					>
						post
					</button>
				</div>
			</div>
		</div>
	);
};

export default PublicationComposer;
```

### Page: CreatePublicationPage

React hooks used:

- [`useActiveProfile`](https://docs.lens.xyz/docs/use-active-profile)

The `CreatePublicationPage` page first loads the active profile, then passes it to the `PublicationComposer` component we just built. Other than that, not much happens here. The magic of componentization takes over, and code we already wrote executes.

Here's the full code:

```js
import React from "react";
import { useActiveProfile } from "@lens-protocol/react";
import PublicationComposer from "../components/PublicationComposer";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import LoginButton from "../components/LoginButton";

const CreatePublication = () => {
	const { data: activeProfile, loading: profileLoading } = useActiveProfile();
	const { isConnected } = useAccount();

	return (
		<div className="w-3/6 bg-background">
			{!isConnected && (
				<div className="object-center self-center mt-[20%]">
					<LoginButton />
				</div>
			)}
			{!activeProfile && (
				<div className="object-center self-center mt-[5%] text-xl ml-5">
					you don't have an active profile, please{" "}
					<a href="/edit-profile" className="underline">
						create one
					</a>
				</div>
			)}
			{isConnected && !profileLoading && activeProfile && (
				<PublicationComposer publisher={activeProfile} />
			)}
		</div>
	);
};

export default CreatePublication;
```

### Component: LeftNav

The left hand navigation component is a simple React component with links to your main feed, the profile editor, and the publication composer. Here's the full code:

```js
import React from "react";

import { SlHome } from "react-icons/sl";
import { SlUser } from "react-icons/sl";
import { AiOutlinePlus } from "react-icons/ai";

const LeftNav = () => {
	return (
		<div className="flex flex-col w-1/6 h-screen sticky top-0  bg-background">
			{" "}
			<a className="mt-5 mb-2 mx-2 self-end" href="/home">
				<SlHome className="hover:h-12 hover:w-12 ease-in-out duration-300 h-10 w-10" />
			</a>
			<a className="my-2 mx-2 self-end" href="/edit-profile">
				<SlUser className="hover:h-12 hover:w-12 ease-in-out duration-300 h-10 w-10" />
			</a>
			<a className="my-2 mx-2 self-end" href="/create-publication">
				<AiOutlinePlus className="hover:h-12 hover:w-12 ease-in-out duration-300 h-10 w-10 rounded-full ring-2 bg-primary hover:bg-secondary" />
			</a>
		</div>
	);
};

export default LeftNav;

```

## Conclusion

Rock-n-roll! You did it, congratulations! If you've been sitting and coding for the last hour or so, I highly recommend you get up, walk around, maybe grab a coffee, and then return to your project.

In about an hour, you build an entire social dApp that rivals OnlyFans or Patreon. You could take this code, customize it, hire a marketing person, and launch your startup. When you build with permissionless and composable tools like Bundlr and Lens, you leverage the infrastructure work done by others to build production apps rapidly. When you pause for a moment and think about this, it's pretty amazing stuff. Even just 5 years ago, building a production-level social application like this would take months or work with a full team. You did it in an hour, siting by yourself in your bedroom. 

That's next-level cool.

## Challenges

You learn a lot from following along with a quest, however to really level up your skills, you need to take charge and build some additional features on your own. Before sharing your quest online and submitting to earn an NFT, pick one of these challenges and add some new features. I intentionally created challenges for all experience levels, pick the one that looks the most fun.

- **UI Challenge:** Want to level up your front-end skills? Try changing my UI. Maybe just change the colors or maybe move everything around. You could try copying the UI of an existing social network or just get super creative and make up your own.
- **Comments:** Most social networks allow people to comment on a profile, try adding in this functionality using the [`useCreateComment`](https://docs.lens.xyz/docs/use-create-comment) React Lens hook
- **Encryption Challenge:** In OnlyBundlr we partially implemented token-gating. We set things so you can set a fee to follow and that publications are only visible to followers. But, in the world of blockchains, information is public unless it's encrypted. Someone could circumvent our token-gating by monitoring Bundlr for new metadata uploads and building a UI to show them. If you're up for a challenging challenge, try building full token-gating by [encrypting publication metadata with Lit Protocol.](https://docs.lens.xyz/docs/gated)
- **DIY Challenge:** Software design is all about being creative and thinking outside of the box. Maybe my challenges bore you and you'd rather do something different? If so, go for it. The last challenge is fully free-form, you think of some new feature and you built it!

## How To Submit Your Work

Once you're done, [upload your project to GitHub](https://docs.github.com/en/get-started/quickstart/hello-world) and [set it up to preview on Vercel.](https://vercel.com/docs/concepts/get-started/deploy). Both GitHub and Vercel are free to use, and represent the best way to start building your portfolio as a developer.

Finally, share your work on Twitter with the hashtags `#Bundlr` and `#BundlrDeveloperQuests`, and [submit to us via this form.](https://forms.gle/BHP2UgmDqw1hPDZy5)

Every week, we'll review submissions and whitelist projects that completed at least one challenge for a free-mint NFT.





