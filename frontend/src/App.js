import React from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import logo from "./logo.png";

function App() {
	const { isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return (
			<div className="app d-flex align-items-center justify-content-center">
				<div className="lds-dual-ring">
					<img src={logo} alt="Loading..." />
				</div>
			</div>
		);
	}

	return (
		<div className="app">
			{isAuthenticated && <Banner />}
			<div className="container">
				<Header />
				<Posts />
			</div>
			<Footer />
		</div>
	);
}

export default App;
