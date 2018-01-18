# Requirements
Using the included api server (see [Installation](#installation)) create a single page application with React. The single page application will be made up of 2 different pages: The first page will be a page that lists all the users in a paginated list. The second page will be a page that displays the user info for the selected user.

The designs for the two pages can be found [Here](./Designs/Inform.png) and [Here](./Designs/UserList.png)

Information about what api requests are available can be found in the [Swagger](#swagger) documentation

# Installation
Install npm dependencies
```bash
npm install
```

### (optional)
You can optionally set your server port. Defaults to 3000
```bash
export SERVER_PORT=3000;
```

# Running the API Server
Start the server
```bash
npm run server
```

# Swagger
Swagger docs can be located at `http://localhost:{SERVER_PORT}/swagger`
