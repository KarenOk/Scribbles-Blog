import React from "react";
import { formattedDatePost, formattedTime } from "../utils";

const sanitizeHtml = require("sanitize-html");

const PostItem = ({ post }) => {
	return (
		<article className="post-item">
			<section className="header d-flex align-items-center">
				<div className="image-cont">
					{post.image_url ? (
						<img src={post.image_url} alt={post.author} className="author" />
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
					{formattedDatePost(post.date_created)}{" "}
				</span>{" "}
				at{" "}
				<span className="highlight"> {formattedTime(post.date_created)} </span>{" "}
				with <span className="highlight"> {post.no_of_comments} </span> comments
			</p>

			<div
				className="intro .truncate-overflow"
				dangerouslySetInnerHTML={{
					__html: sanitizeHtml(post.content, {
						allowedTags: [],
					}),
				}}
			></div>

			<p className="read-more">Read more</p>
		</article>
	);
};

export default PostItem;
