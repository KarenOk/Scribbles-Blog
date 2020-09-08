import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostItem from "./PostItem";
import noPosts from "../images/no-posts-color.svg";
import ReactPaginate from "react-paginate";
import logo from "../logo.png";

const Posts = ({ posts, getPosts, loading }) => {
	const POSTS_PER_PAGE = 5;
	const [pageCount, setPageCount] = useState(0);

	useEffect(() => {
		getPosts();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (posts) setPageCount(Math.ceil(posts.total_posts / POSTS_PER_PAGE));
	}, [posts]); // eslint-disable-line react-hooks/exhaustive-deps

	const handlePageClick = (e) => {
		const selectedPage = e.selected;
		getPosts(selectedPage + 1);
	};

	if (!posts && loading) {
		return (
			<div className="loader d-flex align-items-center justify-content-center">
				<div className="lds-dual-ring">
					<img src={logo} alt="Loading..." />
				</div>
			</div>
		);
	}

	return (
		<div className="posts">
			{posts && posts.posts.length ? (
				<>
					{loading ? (
						<div
							style={{ marginBottom: "30px" }}
							className="loader d-flex align-items-center justify-content-center"
						>
							<div className="lds-dual-ring">
								<img src={logo} alt="Loading..." />
							</div>
						</div>
					) : (
						posts.posts.map((post, index) => (
							<Link to={`/post/${post.id}`}>
								<PostItem key={index} post={post} />
							</Link>
						))
					)}
					<div className="pagination-cont">
						<ReactPaginate
							previousLabel={"<<"}
							nextLabel={">>"}
							breakLabel={"..."}
							breakClassName={"break-me"}
							pageCount={pageCount}
							marginPagesDisplayed={2}
							pageRangeDisplayed={5}
							onPageChange={handlePageClick}
							containerClassName={"pagination"}
							subContainerClassName={"pages pagination"}
							activeClassName={"active"}
						/>
					</div>
				</>
			) : (
				<div className="no-posts">
					<img src={noPosts} alt="" />
					<p> No posts found. </p>
				</div>
			)}
		</div>
	);
};

export default Posts;
