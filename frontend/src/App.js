import React from "react";
import "./App.css";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Footer from "./components/Footer";
import { useAuth0 } from "@auth0/auth0-react";
import Banner from "./components/Banner";

function App() {
	const { isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return (
			<div className="app d-flex align-items-center justify-content-center">
				<h1>Loading ...</h1>
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
