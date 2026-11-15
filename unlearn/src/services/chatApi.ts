// import the shared message type from the study types file
import type { Message } from "../types/study";

// async function to send a chat message to the backend and return the reply
export async function sendMessage(
    message: string,
    history: Message[] = []
): Promise<string> {                                // promise --> function will eventually produce string
    // fetch() is browser function used to make HTTP requests
    const response = await fetch("/api/chat", {
        method: "POST",
        // headers describe request body format
        headers: {
            "Content-Type": "application/json",
        },
        // contains student's message and chat history
        body: JSON.stringify({
            message,
            history,
        }),
    });

    if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
    }

    // typescript types don't guarantee that a server actually returns expected data
    // add runtime response checks here
    const data: unknown = await response.json();

    // check that data is object, isn't null, has reply property, and property contains string
    if (
        typeof data !== "object" ||
        data === null ||
        !("reply" in data) ||
        typeof data.reply !== "string"
    ) {
        throw new Error("Invalid response from chat API");
    }

    // return the ai-generated reply
    return data.reply
}