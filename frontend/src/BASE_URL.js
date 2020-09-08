let BASE_URL;

if (window.location.origin.includes("localhost")) {
	BASE_URL = "http://localhost:5000";
} else {
	BASE_URL = "https://scribbles-blog-api.herokuapp.com/";
}

export { BASE_URL };
