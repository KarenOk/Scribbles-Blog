import React from "react";

const PostItem = ({ post }) => {
	return (
		<article className="post-item">
			<section className="header d-flex align-items-center">
				<div className="image-cont">
					{post.image_url ? (
						<img src={post.image_url} alt={post.author} />
					) : (
						<div />
					)}
				</div>
				<h3> {post.title} </h3>
			</section>
			<p className="details">
				{" "}
				Written by <span className="highlight"> {post.author} </span> on{" "}
				<span className="highlight">
					{" "}
					{new Date(post.date_created).toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}{" "}
				</span>{" "}
				at{" "}
				<span className="highlight">
					{" "}
					{new Date(post.date_created).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}{" "}
				</span>{" "}
				with <span className="highlight"> {post.no_of_comments} </span> comments
			</p>

			<p className="intro"> {post.content} </p>

			<a href="#!" className="read-more">
				Read more
			</a>
		</article>
	);
};

export default PostItem;
