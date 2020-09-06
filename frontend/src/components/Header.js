import React from "react";
import logo from "../logo.png";
import github from "../images/github.png";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import linkedin from "../images/linkedin.png";
import instagram from "../images/instagram.png";

const Header = () => {
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
					<a href="#!"> LOGIN </a>
					<a href="#!"> REGISTER </a>
				</div>
				<div className="social">
					<a href="#!">
						<img className="social" src={twitter} />
					</a>
					<a href="#!">
						<img className="social" src={facebook} />
					</a>
					<a href="#!">
						<img className="social" src={instagram} />
					</a>
					<a href="#!">
						<img className="social" src={linkedin} />
					</a>
					<a href="#!">
						<img className="social" src={github} />
					</a>
				</div>
			</nav>
		</header>
	);
};

export default Header;
