// Import the Express library to build the server and handle HTTP requests.
const express = require("express");

// Initialize the Express app.
const app = express();

// Initialize an empty array to store team data.
let teams = [];

try {
    // Try to load the team data from a JSON file.
    const team_list = require("./teams.json");
    teams = team_list.teams; // Assign the teams from the JSON file to the `teams` array.
} catch (error) {
    // If there is an error (e.g., the file is not found), log the error message.
    console.error(error.message);
}

// Middleware to automatically parse incoming JSON requests (important for POST and PUT requests).
// This makes sure that we can access the data from the request body as a JavaScript object.
app.use(express.json());

// Define a basic GET route that sends a welcome message when the home URL ("/") is accessed.
app.get('/', (req, res) => {
    res.send('welcome to express application: app1');
});

// Define a route to handle GET requests to "/teams" which returns the list of teams.
app.get('/teams', (req, res) => {
    // Send back the `teams` array as the response.
    res.send(teams); 
});

// Define a POST route to add a new team to the `teams` array.
app.post('/teams', (req, res) => {
    // Get the new team data from the request body.
    const team = req.body;

    // Add the new team to the `teams` array and get the new length of the array.
    const new_length = teams.push(team);

    // Send the new length of the array as a response.
    res.send({ new_length });
});

// Define a DELETE route to remove a team based on its ID.
app.delete('/teams/:id', (req, res) => {
    // Extract the `id` from the URL parameters (e.g., /teams/1, id = 1).
    const { id } = req.params;

    // Find the team in the array with the matching `id`.
    const team = teams.find(team => team.id === parseInt(id));

    // Find the index of the team in the array.
    const index = teams.indexOf(team);

    // If the team is found (i.e., index is >= 0), delete it from the array.
    if (index >= 0) {
        const deleted = teams.splice(index, 1); // Remove the team at the found index.
        res.send(deleted); // Send back the deleted team as a response.
    } else {
        // If no team is found, send a "no matching" message.
        res.send({ message: "no matching" });
    }
});

// Define a PUT route to update a team based on its ID.
app.put('/teams/:id', (req, res) => {
    // Extract the `id` from the URL parameters (e.g., /teams/1, id = 1).
    const { id } = req.params;

    // Get the updated team data from the request body.
    const new_team = req.body;

    // Find the team in the array with the matching `id`.
    let team = teams.find(team => team.id === parseInt(id));

    // Find the index of the team in the array.
    const index = teams.indexOf(team);

    // If the team is found, update it with the new data.
    if (index >= 0) {
        // Merge the old team data with the new data, so the existing properties are kept.
        const modified_team = { ...team, ...new_team };
        
        // Replace the old team with the modified team at the found index.
        teams.splice(index, 1, modified_team);
        
        // Send the updated list of teams as a response.
        res.send(teams);
    } else {
        // If no team is found, send a "no matching" message.
        res.send({ message: "no matching" });
    }
});

// Start the server and listen for requests on port 3000.
app.listen(3000, () => {
    console.log("REST API started on port 3000");
});
