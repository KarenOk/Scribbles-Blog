import React from "react";
import editIcon from "../images/edit-icon.svg";
import deleteIcon from "../images/delete-icon.svg";
import empty from "../images/empty.svg";

const PostPage = ({ post }) => {
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
				<div className="d-flex justify-space-between align-items-center">
					<div className="d-flex align-items-center">
						<div className="image-cont">
							{post ? (
								<img
									src={post.image_url}
									alt={post.author}
									className="author"
								/>
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
				<h2>BE MULTIPLY SET YOU'RE, BEARING OWN MAKE PLACE APP</h2>
				<small>
					Last modified at
					<span className="highlight"> {post.last_modified} </span>
				</small>
			</header>

			<section className="content">
				{
					"Primis eros velit lacinia curae; diam congue volutpat. Convallis, tempus. Curabitur ut lacinia taciti sodales. Vitae ut placerat orci elit netus ridiculus habitasse senectus Turpis augue. Hac, rutrum ornare integer.  \n \n Phasellus at iaculis tempor et quis justo montes interdum fusce purus lacus. Commodo. Vehicula tempus Ut eros eget vel curae; porttitor penatibus Laoreet ultrices. Vestibulum. Nisl vestibulum ridiculus, erat. Sociosqu a nascetur, primis dictum curabitur ridiculus.  Sociis orci ligula cras consectetuer vitae ipsum, pede lectus suscipit. Cubilia dignissim leo vel consequat. Leo convallis senectus suspendisse eleifend dapibus ridiculus. \n \n  Metus, interdum semper, ultricies vehicula tristique euismod feugiat pellentesque nascetur dolor elementum. "
				}
			</section>

			<section>Comment section</section>
		</article>
	);
};

export default PostPage;
