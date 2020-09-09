import React, { useState, useEffect } from "react";
import Rodal from "rodal";

function ManagePost({ mode, visible, close, post, createPost, editPost }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		if (mode === "edit" && post) {
			setTitle(post.title);
			setContent(post.content);
		}
	}, [post]);

	const onSubmit = (e) => {
		e.preventDefault();
		console.log("entered");
		if (!title || !content) return;
		if (title.length > 50) return;

		if (mode === "edit") {
			editPost({ title, content });
		} else {
			createPost({ title, content });
		}
		close();
	};
	return (
		<Rodal
			animation="slideRight"
			visible={visible}
			onClose={() => close()}
			className="manage-post"
			height={null}
			width={null}
		>
			{mode === "edit" ? <h1> Edit Post </h1> : <h1> Create a new post </h1>}
			<form id={`manage-post-${mode}`} onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="title"> Post Title </label>
					<input
						id={`title-${mode}`}
						name="title"
						required
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						maxLength="50"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="title"> Post Content </label>
					<textarea
						id={`manage-post-${title}`}
						name="content"
						required
						value={content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
				</div>
			</form>

			<div className="actions">
				<button onClick={() => close()}> Cancel </button>
				<button form={`manage-post-${mode}`} disabled={!title || !content}>
					Submit
				</button>
			</div>
		</Rodal>
	);
}

export default ManagePost;
