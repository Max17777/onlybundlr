import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { LensConfig, staging } from "@lens-protocol/react";
import { LensProvider } from "@lens-protocol/react";
import { localStorage } from "@lens-protocol/react/web";

import LeftNav from "./components/LeftNav";
import RightNav from "./components/RightNav";
import ContentFeed from "./components/ContentFeed";
import ProfileFeed from "./components/ProfileFeed";
import CreateProfile from "./components/CreateProfile";
import EditProfile from "./components/EditProfile";
import CreatePost from "./components/CreatePost";

const { chains, provider, webSocketProvider } = configureChains(
	[polygonMumbai, polygon],
	[publicProvider()],
);

const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});

const lensConfig = {
	bindings: wagmiBindings(),
	environment: staging,
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
							<Route path="/" element={<ContentFeed />} />
							<Route path="/home" element={<ContentFeed />} />
							<Route path="/*" element={<ProfileFeed />} />
							<Route path="/create-profile" element={<CreateProfile />} />
							<Route path="/edit-profile" element={<EditProfile />} />
							<Route path="/create-post" element={<CreatePost />} />
						</Routes>
					</BrowserRouter>
					<RightNav />
				</div>
			</LensProvider>
		</WagmiConfig>
	);
}

export default App;
