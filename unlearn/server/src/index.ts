// dotenv/config reads the .env file and loads the values into Node.js environment variables
import "dotenv/config";
// imports the class we'll use to communicate with gemini
// the class is like a blueprint for creating objects
// will create an object that knows how to make gemini api requests
import { GoogleGenAI } from "@google/genai";
// brings express library into file
// use express to build a server!
import express from "express";

// create an express application instance
const app = express();

// react frontend normally runs on port 5173
// make backend run on port 3001
const PORT = 3001;

// get API key from the environment (.env)
const apiKey = process.env.GEMINI_API_KEY;

// if key doesn't exist, throw error and stop server
if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in server/.env");
}

// create gemini client that we'll use for API requests
const ai = new GoogleGenAI({ apiKey });

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

// create an endpoint for testing gemini
app.get("/api/test-gemini", async (_req, res) => {
    try {
        // call gemini api and identify its model & contents we want to send to it
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: "Sing the lyrics of SVT kpop group song Maestro.",
        });

        // if no response back, provide a default message
        res.json({
            message: response.text ?? "Gemini returned no text. :(",
        });
    } catch (error) {
        console.error("Gemini API error:", error);

        res.status(500).json({
            error: "Failed to get a response from Gemini.",
        });
    }
});

app.post("/api/chat", async (req, res) => {
    try {
        // object destructuring
        // short for const message = req.body.message;
        const { message } = req.body;

        if (typeof message !== "string" || !message.trim()) {
            res.status(400).json({
                error: "A message is required.",
            });
            return;
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: message,
        });

        res.json({
            message: response.text ?? "Gemini returned no text. :(",
        });
    } catch (error) {
        console.error("Gemini API error:", error);

        res.status(500).json({
            error: "Failed to get a response from Gemini.",
        });
    }
});

// start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});