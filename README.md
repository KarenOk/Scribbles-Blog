# Scribbles Blog

Scribbles is a full stack blog application written using Flask and React. Its allows authors manage blog posts while readers can read and comment on each blog post. The blog posts are also available to users that are not logged in, but they are limited to just reading - they can't comment.

Click here to view the hosted [Scribbles web application](http://scribbles-blog.netlify.app). The backend API is hosted on Heroku and can be accessed using the following BASE_URL - `http://scribbles-blog.netlify.app`. Click here to view the [Scribbles API documentation](https://araniera.stoplight.io/docs/scribbles-blog/reference/Scribbles.v1.yaml).

## Getting Started (Run Locally)

This project makes use of **ReactJS** and **Node** for the frontend, with **Flask**, **PostgreSQL** and **SQLAlchemy** for the backend. [**Auth0**](https://auth0.com) is employed as the authenication service for this project. To be able to run this project locally, all the aforementioned tools have to be set up properly.

### Setting Up Auth0

[Auth0](https://auth0.com) is a service that enables easy integration of authentication and authorization to an application. To set up Auth0 to be used with this project, the following steps should be followed:

1.  Create an Auth0 account and navigate to the dashboard.
2.  Create and select a unique tenant domain.
3.  Under the Application tab, create a new _single page web application_
4.  Create a new API
    - Under API settings, enable **RBAC** and **Add Permissions to access token**
5.  Create new API permissions:
    - `create:post`
    - `update:post`
    - `delete:post`
    - `create:comment`
    - `delete:comment`
6.  Create new roles and add permissions for:
    - Reader
      - `create:comment`
    - Author
      - `create:comment`
      - `delete:comment`
      - `create:post`
      - `update:post`
      - `delete:post`,
7.  Under the Rules tab, create two new rules, both with empty rule templates:

    - The first rule is to automatically assign a role to any user that signs up. Paste the following code:

      ```
      function (user, context, callback) {
        var count = context.stats && context.stats.loginsCount ? context.stats.loginsCount : 0;
        if (count > 1) {
            return callback(null, user, context);
        }

        var ManagementClient = require('auth0@2.17.0').ManagementClient;
        var management = new ManagementClient({
            token: auth0.accessToken,
            domain: auth0.domain
        });

        if (user.email && user.email.toLowerCase().includes("author")){
            management.assignRolestoUser(
                { id : user.user_id},
                { "roles" :["rol_role-id-of-author"]},  // replace the rol_role-id-of-author with the role ID of the Author role you created in step 6
                function (err) {
                    if (err) {
                        console.log('Error assigning role: ' + err);
                    }
                    callback(null, user, context);
                }
            );
        }
        else{
            management.assignRolestoUser(
                { id : user.user_id},
                { "roles" :["rol_role-id-of-author"]},   // replace the rol_role-id-of-reader with the role ID of the Reader role you created in step 6
                function (err) {
                    if (err) {
                        console.log('Error assigning role: ' + err);
                    }
                    callback(null, user, context);
                }
            );
        }
      }
      ```

      The above rule assigns the **author** role to any email that contains the word _author_ and the **reader** role otherwise. Remember to replace the rol_role-id-of-\* with the role IDs of the Author and Reader roles you created in step 6. The role id can be gotten from Auth0's URL for each role.

    - The second rule adds the user's role to the payload returned by Auth0 when a user logs in. Paste in the following code:

    ```
    function setRolesToUser(user, context, callback) {

        user.app_metadata = user.app_metadata || {};

        const addRolesToUser = function (user) {
            if (user.email && user.email.toLowerCase().includes("author")) {
                return ['author'];
            }
            return ['reader'];
        };

        const roles = addRolesToUser(user);

        user.app_metadata.roles = roles;
        auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
            .then(function () {
                context.idToken['https://scribbles-blog.com/roles'] = user.app_metadata.roles;
                callback(null, user, context);
            })
            .catch(function (err) {
                callback(err);
            });
    }
    ```

### Backend

The `./backend` directory contains a completed Flask application. You would need to set up your environment and some environment variables to run the application successfully.

[Find the steps to set up the backend server locally in the backend's README](./backend/README.md).

### Frontend

The `./frontend` directory contains a completed ReactJS web application that consumes the data from the Flask server. You would also need to set up some environment variables to run the frontend application successfully.

[Find the steps to set up the front-end web application locally in the front-end's README](./frontend/README.md)/
