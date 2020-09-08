let BASE_URL;

if (window.location.origin.includes("localhost")) {
	BASE_URL = "http://localhost:5000";
} else {
	BASE_URL = "http://localhost:5000";
}

export { BASE_URL };
