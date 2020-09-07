import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Banner = () => {
	const { user } = useAuth0();
	return (
		<div className="banner">
			<p>
				Logged in as {user.name}.
				{user["https://scribbles-blog.com/roles"][0] === "author" ? (
					<span>
						{" "}
						You're an<span className="highlight"> author</span>.{" "}
					</span>
				) : (
					<span>
						{" "}
						You're a <span className="highlight"> reader</span>.{" "}
					</span>
				)}
			</p>
		</div>
	);
};

export default Banner;
