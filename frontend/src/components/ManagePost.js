import React, { useState } from "react";
import Rodal from "rodal";

function ManagePost({ visible, close, createPost }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		console.log("entered");
		if (!title || !content) return;
		if (title.length > 50) return;

		try {
			createPost({ title, content });
			close();
			setTitle("");
			setTitle("");
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Rodal
			visible={visible}
			onClose={() => close()}
			className="manage-post"
			height={null}
			width={null}
		>
			<h1> Create a new post </h1>
			<form id="manage-post" onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="title"> Post Title </label>
					<input
						id="title"
						name="title"
						required
						onChange={(e) => setTitle(e.target.value)}
						maxLength="50"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="title"> Post Content </label>
					<textarea
						id="content"
						name="content"
						required
						value={content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
				</div>
			</form>

			<div className="actions">
				<button onClick={() => close()}> Cancel </button>
				<button form="manage-post" disabled={!title || !content}>
					Submit
				</button>
			</div>
		</Rodal>
	);
}

export default ManagePost;
