import React from "react";
import PostItem from "./PostItem";

const post = {
	title: "The 5 Step Rule to financial freedom",
	content:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet. Elementum eu facilisis sed odio morbi quis commodo odio aenean. Sed viverra ipsum nunc aliquet. Vulputate mi sit amet mauris commodo quis imperdiet massa. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Quis viverra nibh cras pulvinar mattis nunc sed. Suspendisse interdum consectetur libero id faucibus nisl. Metus vulputate eu scelerisque felis imperdiet. In cursus turpis massa tincidunt dui ut ornare lectus.",
	date_created: new Date(),
	author: "Karen Okonkwo",
	comments: [
		{
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
			user: "ioweu1234",
		},
		{
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
			user: "ioweu1234",
		},
		{
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
			user: "ioweu1234",
		},
		{
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
			user: "ioweu1234",
		},
		{
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
			user: "ioweu1234",
		},
	],
};

const Posts = () => {
	return (
		<div className="posts">
			{new Array(10).fill(0).map((item, index) => (
				<PostItem key={index} post={post} />
			))}
		</div>
	);
};

export default Posts;
