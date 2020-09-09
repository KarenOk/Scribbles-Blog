import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { BASE_URL } from "../BASE_URL";
import editIcon from "../images/edit-icon.svg";
import deleteIcon from "../images/delete-icon.svg";
import empty from "../images/empty.svg";
import logo from "../logo.png";

const PostPage = ({ match, token }) => {
	const { user } = useAuth0();
	const [post, setPost] = useState(null);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(null);
	const [commentsPage, setCommentsPage] = useState(1);
	const [loadingPost, setLoadingPost] = useState(false);
	const [loadingComments, setLoadingComments] = useState(false);

	useEffect(() => {
		getPost();
	}, []);

	useEffect(() => {
		if (post) getComments(1);
	}, [post]);

	useEffect(() => {
		console.log(comments);
	}, [comments]);

	const getPost = (page) => {
		setLoadingPost(true);
		fetch(`${BASE_URL}/posts/${match.params.id}`)
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					console.log(res.error);
					toast.error(
						"😞 Uh-oh. Something went wrong while fetching this post.",
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
					setPost(res.post);
				}
				setLoadingPost(false);
			})
			.catch((err) => {
				console.log(err);
				toast.error(
					"😞 Uh-oh. Something went wrong while fetching the comments for this post.",
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
				setLoadingPost(false);
			});
	};

	const getComments = (page, clear = false) => {
		if (!post) return;

		setLoadingComments(true);
		fetch(
			`${BASE_URL}/posts/${post.id}/comments?page=${
				clear ? page : commentsPage
			}`
		)
			.then((res) => res.json())
			.then((res) => {
				if (res.error) {
					console.log(res.error);
					toast.error(
						"😞 Darn. Something went wrong while fetching the comments for this post.",
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
					console.log(res.comments);
					if (clear) {
						setComments(res);
						setCommentsPage(2);
					} else {
						if (comments) {
							const temp = [...comments.comments];
							temp.push(...res.comments);
							setComments({ ...comments, comments: temp });
						} else setComments(res);

						setCommentsPage(commentsPage + 1);
					}
				}
				setLoadingComments(false);
			})
			.catch((err) => {
				console.log(err);
				toast.error(
					"😞 Darn. Something went wrong while fetching the comments for this post.",
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
				setLoadingComments(false);
			});
	};

	const createComment = () => {
		let body = {
			full_name: user.name,
			image_url: user.picture,
			is_author: user["https://scribbles-blog.com/roles"][0] === "author",
			comment: newComment,
		};

		fetch(`${BASE_URL}/posts/${post.id}/comments`, {
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
					// setLoadingComments(false);
					toast.error(
						"😞 Oops. Something went wrong while publishing your comment.",
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
					setNewComment("");
					getComments(1, true);
					toast.dark("💃 Whoop! Your comment has been published.", {
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
				toast.error(
					"😞 Oops. Something went wrong while publishing your comment.",
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

	if (loadingPost) {
		return (
			<div className="loader d-flex align-items-center justify-content-center">
				<div className="lds-dual-ring">
					<img src={logo} alt="Loading..." />
				</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="post-page no-post d-flex flex-column align-items-center">
				<img src={empty} alt="" />
				<p>No post here!</p>
			</div>
		);
	}
	return (
		<article className="post-page">
			<header className="header">
				<div className="top d-flex justify-space-between align-items-center ">
					<div className="d-flex align-items-center">
						<div className="image-cont">
							{post.image_url ? (
								<img src={post.image_url} alt={post.author} className="user" />
							) : (
								<div />
							)}
						</div>
						<div>
							<p className="highlight"> {post.author} </p>
							<small>
								{new Date(post.date_created).toLocaleDateString(undefined, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</small>
						</div>
					</div>
					<div className="actions">
						<button title="Edit this post">
							<img src={editIcon} alt="Edit post" />
						</button>
						<button title="Delete this post">
							<img src={deleteIcon} alt="Delete post" />
						</button>
					</div>
				</div>
				<h2>{post.title}</h2>
				<small>
					Last modified at
					<span className="highlight"> {post.last_modified} </span>
				</small>
			</header>

			<section className="content">{post.content}</section>

			<section className="comments">
				<h3>
					{post.no_of_comments}{" "}
					{post.no_of_comments === 1 ? "comment" : "comments"}
				</h3>
				<div className="d-flex">
					<div className="image-cont">
						{user.picture ? (
							<img src={user.picture} alt={user.name} />
						) : (
							<div />
						)}
					</div>
					<input
						aria-label="Leave a comment"
						placeholder="Leave a comment"
						maxLength="140"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						onKeyUp={(e) =>
							e.keyCode === 13 && newComment ? createComment() : null
						}
						required
					/>
				</div>

				<div className="comments-cont">
					{!comments || !comments.total_comments ? (
						<p> No comments found </p>
					) : (
						comments.comments.map((comment) => (
							<div className="comment-box d-flex" key={comment.id}>
								<div className="image-cont">
									{comment.image_url ? (
										<img
											src={comment.image_url}
											alt={comment.full_name}
											className="user"
										/>
									) : (
										<div />
									)}
								</div>
								<div>
									<p className="info">
										{comment.full_name}{" "}
										<small>
											{" "}
											{new Date(comment.date_created).toLocaleString(
												undefined,
												{
													year: "numeric",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												}
											)}{" "}
										</small>{" "}
									</p>
									<p className="comment"> {comment.comment}</p>
								</div>
								<div>
									<button>
										<img
											src={deleteIcon}
											alt="Delete comment"
											className="icon"
										/>
									</button>
								</div>
							</div>
						))
					)}
				</div>
				{(comments && !comments.comments.length) ||
				(comments &&
					comments.comments.length !== 0 &&
					comments.total_comments <= comments.comments.length) ? (
					<div />
				) : (
					<div className="load">
						<button onClick={getComments} disabled={loadingComments}>
							{loadingComments ? "Loading..." : "Load more comments"}
						</button>
					</div>
				)}
			</section>
		</article>
	);
};

export default PostPage;
