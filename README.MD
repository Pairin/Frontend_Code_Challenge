# Requirements
Using the included api server (see [Installation](#installation)) create a single page application with React. The single page application will be made up of 2 different pages: The first page will be a page that lists all the users in a paginated list. The second page will be a page that displays the user info for the selected user.

The designs for the two pages can be found [Here](./Designs/Inform.png) and [Here](./Designs/UserList.png)

Information about what api requests are available can be found in the [Swagger](#swagger) documentation

## User List
[Design](./Designs/UserList.png)

The user list should contain the following features:

- A List of all users
- The ability to sort users in the lists
- Pagination for the users (Since there are 1000 in the system)

## Information Page
[Design](./Designs/Inform.png)

The information page should contain the following features:

- The header should include the current selected user's name
- A Masthead that shows the currently selected quality
  - Driver, General Style, Social Emotional, and Virtue
- A Chart showing the ranges for each Score with the Real and Ideal score values charted (ranging from -50 to 50)
- Filters for the graph
  - Enable / Disable scores to show
  - Toggle whether to show valid or invalid results
    - Valid, Invalid, All scores
  - Toggle Ideal scores
  - Change selected Quality

# Evaluation
This project is meant to evaluate your ability to take fairly vague requirements and implement them. We are looking at how well you can handle advanced CSS implementation, how clean your code is, how well you can handle basic computer science topics; such as sorting and filtering of data, and how well you integrate into backend services (including handling random errors). You are not required to implement everything in the design, but features completed will be a factor when comparing candidates.

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
