import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Banner = () => {
	const { user } = useAuth0();
	return (
		<div className="banner">
			<p>Logged in as {user.name}</p>
		</div>
	);
};

export default Banner;
