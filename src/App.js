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
