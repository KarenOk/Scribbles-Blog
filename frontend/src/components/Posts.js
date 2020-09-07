import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import noPosts from "../images/no-posts.svg";
import ReactPaginate from "react-paginate";
import logo from "../logo.png";

const Posts = ({ posts, getPosts, loading }) => {
	const POSTS_PER_PAGE = 5;
	const [pageNo, setPageNo] = useState(0);
	const [pageCount, setPageCount] = useState(0);

	useEffect(() => {
		getPosts();
	}, []);

	useEffect(() => {
		if (posts) setPageCount(Math.ceil(posts.total_posts / POSTS_PER_PAGE));
	}, [posts]);

	useEffect(() => {
		getPosts(pageNo + 1);
	}, [pageNo]);

	const handlePageClick = (e) => {
		const selectedPage = e.selected;
		setPageNo(selectedPage);
	};

	if (loading) {
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
			{posts ? (
				<>
					{posts.posts.map((post, index) => (
						<PostItem key={index} post={post} />
					))}
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
