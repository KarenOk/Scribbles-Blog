import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import editIcon from "../images/edit-icon.svg";
import deleteIcon from "../images/delete-icon.svg";
import empty from "../images/empty.svg";

const PostPage = ({ post }) => {
	const { user } = useAuth0();

	const comment = {
		comment:
			"The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz!",
		full_name: "Karen Okonkwo",
		date_created: new Date(),
		image_url: null,
	};

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
				{post.content}
				{
					"Primis eros velit lacinia curae; test diam congue volutpat. Convallis, tempus. Curabitur ut lacinia taciti sodales. Vitae ut placerat orci elit netus ridiculus habitasse senectus Turpis augue. Hac, rutrum ornare integer.  \n \n Phasellus at iaculis tempor et quis justo montes interdum fusce purus lacus. Commodo. Vehicula tempus Ut eros eget vel curae; porttitor penatibus Laoreet ultrices. Vestibulum. Nisl vestibulum ridiculus, erat. Sociosqu a nascetur, primis dictum curabitur ridiculus.  Sociis orci ligula cras consectetuer vitae ipsum, pede lectus suscipit. Cubilia dignissim leo vel consequat. Leo convallis senectus suspendisse eleifend dapibus ridiculus. \n \n  Metus, interdum semper, ultricies vehicula tristique euismod feugiat pellentesque nascetur dolor elementum. "
				}
			</section>

			<section className="comments">
				<h3>
					{post.no_of_comments}{" "}
					{post.no_of_comments === 1 ? "comment" : "comments"}
				</h3>
				<form className="d-flex">
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
						required
					/>
				</form>

				<div className="comments-cont">
					{[1, 2, 3, 4].map((item) => (
						<div className="comment-box d-flex" key={item}>
							<div className="image-cont">
								{comment.picture ? (
									<img src={comment.picture} alt={comment.name} />
								) : (
									<div />
								)}
							</div>
							<div>
								<p className="info">
									{comment.full_name}{" "}
									<small>
										{" "}
										{comment.date_created.toLocaleString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}{" "}
									</small>{" "}
								</p>
								<p className="comment"> {comment.comment}</p>
							</div>
							<div>
								<button>
									<img src={deleteIcon} alt="Delete comment" className="icon" />
								</button>
							</div>
						</div>
					))}
				</div>
				<div className="load">
					<button> Load more comments</button>
				</div>
			</section>
		</article>
	);
};

export default PostPage;
