This repository contains the code for <http://brained.io>.

# Installation

1. Install node/npm from <http://nodejs.org/>.

2. Install mongodb from <http://mongodb.org/>. Start it locally.

3. Install bower:

    ```bash
      sudo npm install -g bower
    ```

(Skip "sudo" if using Windows.)

4. Clone this repository:

    ```bash
      git clone git@github.com:Verold/brained.io.git
      cd brained.io
    ```

5. Run `bower install`.

6. Run `npm install`.

# Starting the Server

The server can be run with `node server/app.js`, but requires a number of
environment variables to be set. They can either be set using an `export`
command or by prefixing node invocation using the following format:

```bash
  VARIABLE1=value1 VARIABLE2=value2 node server/app.js
```

The following variables must be set in all environments:

* __NODE_ENV__: The environment, either "local" or "production".
* __AWS_S3_BUCKET__: The name of the AWS S3 bucket to use for uploads.
* __AWS_ACCESS_KEY__: AWS access key.
* __AWS_SECRET_KEY__: AWS secret key.
* __FACEBOOK_CLIENT_SECRET__: Client secret for Facebook authentication.†
* __GOOGLE_CLIENT_SECRET__: Client secret for Google authentication.†

† You can disable Facebook or Google authentication in config/local.json.

Additionally, the following environment variables need to be set in the
production environment:

* __PORT__: Port number, e.g., '3000'.
* __DATABASE_PASSWORD__: The password for the database.
* __TWITTER_CLIENT_SECRET__: Client secret for Twitter authentication.
* __COOKIE_SECRET__: the secret for generating cookies.

The following environment variables are optional:

* __LOG_LEVEL__: One of: 'error', 'info', 'verbose', 'debug'.

# Deploying to Heroku

Deploying to Heroku is a matter of pushing to your Heroku remote.

# Additional Resources

Brained.io is implemented as a Koast app. See
<https://github.com/rangle/koast> for more information on how to configure and
run Koast.

# Contributors

* Varun Vachhar (@winkerVsBecks), rangle.io
* Simon Ramsey, rangle.io
* Sumit Arora (@sumitarora), rangle.io
* Yuri Takhteyev (@yuri), rangle.io
