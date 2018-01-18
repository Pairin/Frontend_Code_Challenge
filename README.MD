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
Evaluation of candidates will be factored based on 3 main criteria:

- CSS
  - How well you implement your CSS
  - How advanced your CSS techniques are
- Code
  - How clean your code is
  - How modular/portable it is
  - How well you know and utilize React functionality
- Fundamentals
  - How well your CS Fundamentals are
    - Sorting
    - Filtering
  - How well you handle errors and unexpected faults
  - How well you can take unfamiliar data and understand it.

This project is meant to evaluate your ability to take fairly vague requirements and implement them. You are not required to implement everything in the design, but features completed will be a factor when comparing candidates.

Timeliness is also a huge factor. While there is no timeline, we are evaluating candidates on a rolling basis and how long you take to complete the challenge will factor into everything.

# Submission
Upon completion zip the directory (minus the node_modules folder) and email it to [smakinson@pairin.com](mailto:smakinson@pairin.com)

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
