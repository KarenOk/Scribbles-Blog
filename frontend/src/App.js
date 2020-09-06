import React from "react";
import "./App.css";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Footer from "./components/Footer";

function App() {
	return (
		<div className="app">
			<div className="container">
				<Header />
				<Posts />
			</div>
			<Footer />
		</div>
	);
}

export default App;
