import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import logo from "./logo.png";
import ManagePost from "./components/ManagePost";

function App() {
	const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

	const [token, setToken] = useState(null);

	const [posts, setPosts] = useState(null);
	const [loadingPosts, setLoadingPosts] = useState(false);

	const [showManagePost, setShowManagePost] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			(async function () {
				let token = await getAccessTokenSilently();
				setToken(token);
			})();
		}
	}, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

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

	const createPost = (body) => {
		console.log("jkjfkfk");
		setLoadingPosts(true);
		fetch("http://localhost:5000/posts", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				getPosts();
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

	const notify = () => toast("Wow so easy !");

	return (
		<div className="app">
			{isAuthenticated && <Banner />}
			<div className="container">
				<Header showCreatePost={() => setShowManagePost(true)} />
				<Posts posts={posts} getPosts={getPosts} loading={loadingPosts} />
			</div>
			<Footer />
			<ManagePost
				visible={showManagePost}
				close={() => setShowManagePost(false)}
				createPost={createPost}
			/>
			<button onClick={notify}>Notify !</button>

			<ToastContainer />
		</div>
	);
}

export default App;
