import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../logo.png";
import github from "../images/github.png";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import linkedin from "../images/linkedin.png";
import instagram from "../images/instagram.png";

const Header = ({ showCreatePost }) => {
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	return (
		<header>
			<div>
				<img src={logo} alt="Scribbles" />
				<h1> Scribbles </h1>
			</div>
			<p> DOCUMENT YOUR THOUGHTS AND MUSINGS...</p>
			<nav>
				<div className="routes">
					<a href="#!" className="active">
						POSTS
					</a>
					{!isAuthenticated && (
						<a href="#!" onClick={() => loginWithRedirect()}>
							LOGIN/REGISTER
						</a>
					)}
					{isAuthenticated &&
						user["https://scribbles-blog.com/roles"][0] === "author" && (
							<a href="#!" onClick={showCreatePost}>
								CREATE POST
							</a>
						)}
					{isAuthenticated && (
						<a
							href="#!"
							className="danger"
							onClick={() => logout({ returnTo: window.location.origin })}
						>
							LOGOUT
						</a>
					)}
				</div>
				<div className="social">
					<a href="https://www.twitter.com/">
						<img
							className="social"
							src={twitter}
							alt="Reach out to us on twitter"
						/>
					</a>
					<a href="https://www.facebook.com/">
						<img
							className="social"
							src={facebook}
							alt=" Reach out to us on facebook"
						/>
					</a>
					<a href="https://www.instagram.com/">
						<img
							className="social"
							src={instagram}
							alt=" Reach out to us on instagram"
						/>
					</a>
					<a href="https://www.linkedin.com/in/karenokonkwo/">
						<img
							className="social"
							src={linkedin}
							alt=" Reach out to us on linkedin"
						/>
					</a>
					<a href="http://github.com/KarenOk">
						<img
							className="social"
							src={github}
							alt=" Reach out to us on github"
						/>
					</a>
				</div>
			</nav>
		</header>
	);
};

export default Header;
