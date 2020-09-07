import React, { useState, useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import logo from "./logo.png";

function App() {
	const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
	const [token, setToken] = useState(null);
	const [posts, setPosts] = useState(null);
	const [loadingPosts, setLoadingPosts] = useState(false);

	useEffect(() => {}, []);

	useEffect(() => {
		if (isAuthenticated) {
			(async function () {
				let token = await getAccessTokenSilently();
				setToken(token);
			})();
		}
	}, [isAuthenticated]);

	useEffect(() => {
		console.log(posts);
	}, [posts]);

	const getPosts = (page) => {
		setLoadingPosts(true);
		fetch("http://localhost:5000/posts" + (page ? `?page=${page}` : ""))
			.then((res) => res.json())
			.then((res) => {
				setPosts(res);
				setLoadingPosts(false);
			})
			.catch((err) => {
				console.log(err);
				setLoadingPosts(false);
			});
	};

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
				<Posts posts={posts} getPosts={getPosts} loading={loadingPosts} />
			</div>
			<Footer />
		</div>
	);
}

export default App;
