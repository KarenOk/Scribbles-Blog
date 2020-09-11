# Scribbles Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Environment

Its recommended to work within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual environment for a platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by navigating to the `/backend` directory and running `pip install -r requirements.txt`. This will install all of the required packages we selected within the `requirements.txt` file.

## Setting up the Database

Find steps to install and [get started with PostgreSQL](https://www.postgresqltutorial.com/install-postgresql/) here.

## Running the server

From within the `./backend` directory, first ensure you are working using your created virtual environment. Then, export the required environment variables in your terminal. Run the following commands after updating the values accordingly:

```
export DATABASE_URL='postgres://postgres:postgres@localhost:5432/scribbles_blog'
export API_AUDIENCE="your-auth0-custom-api-audience"
export AUTH0_DOMAIN="your-auth0-tenant-domain"
export FLASK_APP=app.py
export FLASK_ENV=development
```

After setting the above environment variables, run `flask run` to start the server. The server will run on `http://localhost:5000`.

## Testing the application

To test the application, a [postman collection](./Scribbles-Blog.postman_collection.json) has been provided together with a [python test script](./test_app.py).
Both require you to register 2 users - assign the Author role to one and Reader role to the other. Sign into each account and make note of their JWTs.

### Testing with Postman

1. Import the postman collection `./Scribbles-Blog.postman_collection.json`
2. Right-clicking the collection folder for author and reader, navigate to the authorization tab, and including the JWT in the token field (you should have noted these JWTs).
3. Run the shell script _before_pm_test_run.sh_ with the command
   `bash ./before_pm_test_run.sh`. This drops and creates the scribbles_blog_test database, sets it up using a migration script and populates it with data to use to test.
4. Run the collection.

### Testing with the test script

1. Run the following commands after updating the values accordingly to set the environment variables:

```
export DATABASE_URL='postgres://postgres:postgres@localhost:5432/scribbles_blog'
export API_AUDIENCE="your-auth0-custom-api-audience"
export AUTH0_DOMAIN="your-auth0-tenant-domain"
export FLASK_APP=app.py
export FLASK_ENV=development
export JWT="the-jwt-token-for-an-author"
```

2. Ensure you are in the `./backend` directory. Run the tests with:

```
    dropdb scribbles_blog_test
    createdb scribbles_blog_test
    python test_flaskr.py
```

## API Reference

Find the [API documentation](https://araniera.stoplight.io/docs/scribbles-blog/reference/Scribbles.v1.yaml) here.
