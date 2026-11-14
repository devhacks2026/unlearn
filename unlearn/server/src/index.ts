// brings express library into file
// use express to build a server!
import express from "express";

// create an express application instance
const app = express();

// react frontend normally runs on port 5173
// make backend run on port 3001
const PORT = 3001;

// tells express how to interpret incoming JSON request bodies
app.use(express.json());

// creates an endpoint that handles HTTP GET requests
// /api/health is the URL path (example for now)
// _req represents incoming HTTP request object
// res represents the HTTP response object used to send data back to the client
app.get("/api/health", (_req, res) => {
    // send JSON data to client
    res.json({
        status: "ok",
        message: "Unlearn backend is running!",
    });
});

// start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});