# Classroom

How to run:

- Clone this repository or fork it.
  `git clone https://github.com/kimlimjustin/Classroom.git` or `git clone https://github.com/<your username>/Classroom.git`

- Inside `server` folder, create a new file called `.env` which stores your `ATLAS_URI`, `SECURITY_KEY` and `CLIENT_URL` information
  - store your database URI inside `ATLAS_URI` variable
  - store your security key inside `SECURITY_KEY` variable
  - store your client url inside `CLIENT_URL` variable
    example:
  ```
  ATLAS_URI =mongodb+srv://admin:<password>@cluster0.8aezk.gcp.mongodb.net/classroom?retryWrites=true&w=majority
  SECURITY_KEY = D73373D9B4ED6FEC5B8B2DAF6WA929B1C7D14CDC88B196EBDCCEA77AFF7BB9
  CLIENT_URL = http://localhost:3000/
  ```
- Inside `client` folder, create a new file called `.env` which stores your `REACT_APP_SECURITY_KEY` and `REACT_APP_BACKEND_URL` informations

  - store your security key inside `REACT_APP_SECURITY_KEY` variable, note that this value must same as `SECURITY_KEY` in `server/.env` file
  - store your server url inside `REACT_APP_BACKEND_URL` variable
    example:

  ```
  REACT_APP_SECURITY_KEY = D73373D9B4ED6FEC5B8B2DAF6WA929B1C7D14CDC88B196EBDCCEA77AFF7BB9
  REACT_APP_BACKEND_URL = http://localhost:5000
  ```

- install all dependencies.
  - Client side:
    on the `client` directory type `npm install`
  - Server side:
    on the `server` directory type `npm install`
- Run it on node js:
  - Client side:
    on the `client` directory type `npm start`
  - Server side:
    on the `server` directory type `npm start`
