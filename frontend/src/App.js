import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { BASE_URL } from "./BASE_URL";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import ManagePost from "./components/ManagePost";
import Post from "./components/PostPage";
import logo from "./logo.png";

function App() {
	const {
		isAuthenticated,
		isLoading,
		getAccessTokenSilently,
		user,
	} = useAuth0();

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
		fetch(`${BASE_URL}/posts` + (page ? `?page=${page}` : ""))
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					console.log(res.error);
					toast.error(
						"😞 Darn. Something went wrong while fetching your posts.",
						{
							position: "top-center",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						}
					);
				} else {
					setPosts(res);
				}
				setLoadingPosts(false);
			})
			.catch((err) => {
				console.log(err);
				toast.error(
					"😞 Darn. Something went wrong while fetching your posts.",
					{
						position: "top-center",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					}
				);
				setLoadingPosts(false);
			});
	};

	const createPost = (body) => {
		setLoadingPosts(true);
		body.author = user.name;
		body.image_url = user.picture;

		fetch(`${BASE_URL}/posts`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					console.log(res.error);
					setLoadingPosts(false);
					toast.error(
						"😞 Bummer. Something went wrong while creating your post.",
						{
							position: "top-center",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						}
					);
				} else {
					getPosts();
					setLoadingPosts(false);
					toast.dark("💃 Yay! Your post has been uploaded.", {
						position: "top-center",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				setLoadingPosts(false);
				toast.error(
					"😞 Bummer. Something went wrong while creating your post.",
					{
						position: "top-center",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					}
				);
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
		<div className="app d-flex flex-column">
			<Router>
				{isAuthenticated && <Banner />}
				<div className="container">
					<Header showCreatePost={() => setShowManagePost(true)} />
					<Switch>
						<Route
							path="/post/:id"
							exact
							render={(props) => (
								<Post {...props} token={token ? token : null} />
							)}
						/>
						<Route
							path="/"
							render={() => (
								<Posts
									posts={posts}
									getPosts={getPosts}
									loading={loadingPosts}
								/>
							)}
						/>
					</Switch>
				</div>
				<Footer />
				<ManagePost
					visible={showManagePost}
					close={() => setShowManagePost(false)}
					createPost={createPost}
				/>

				<ToastContainer
					position="top-center"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</Router>
		</div>
	);
}

export default App;
