import React from "react";

const PostItem = ({ post }) => {
	return (
		<article className="post-item">
			<h3> {post.title} </h3>
			<p className="details">
				{" "}
				Written by <span className="highlight"> {post.author} </span> on{" "}
				<span className="highlight">
					{" "}
					{post.date_created.toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}{" "}
				</span>{" "}
				at{" "}
				<span className="highlight">
					{" "}
					{post.date_created.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}{" "}
				</span>{" "}
				with <span className="highlight"> {post.comments.length} </span>{" "}
				comments
			</p>

			<p className="intro"> {post.content} </p>

			<a href="#!" className="read-more">
				Read more
			</a>
		</article>
	);
};

export default PostItem;
