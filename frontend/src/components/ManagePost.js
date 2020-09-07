import React, { useState } from "react";
import Rodal from "rodal";

function ManagePost({ visible, close, createPost }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		createPost({ title, content });
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
			<form id="manage-post">
				<div className="form-group">
					<label htmlFor="title"> Post Title </label>
					<input
						id="title"
						name="title"
						required
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="title"> Post Content </label>
					<textarea
						id="content"
						name="content"
						required
						onChange={(e) => setContent(e.target.value)}
					></textarea>
				</div>
			</form>

			<div className="actions">
				<button onClick={() => close()}> Cancel </button>
				<button form="manage-post">Submit</button>
			</div>
		</Rodal>
	);
}

export default ManagePost;
