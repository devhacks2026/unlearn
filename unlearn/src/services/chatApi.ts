// import the shared message type from the study types file
import type { Message, UnderstandingStatus } from "../types/study";

// define structure of assessment of one concept
export interface ConceptAssessment {
    concept: string;
    status: UnderstandingStatus;
    explanation: string;
}

// define complete response from backend
// chat reply + potentially multiple concept assessments
export interface ChatResponse {
    reply: string;
    assessments: ConceptAssessment[];
}

// async function to send a chat message to the backend and return the reply
export async function sendMessage(
    message: string,
    history: Message[] = []
): Promise<ChatResponse> {                                // promise --> function will eventually produce string
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

    if (
        typeof data !== "object" ||
        data === null ||
        !("reply" in data) ||
        typeof data.reply !== "string" ||
        !("assessments" in data) ||
        !Array.isArray(data.assessments)
    ) {
        throw new Error("Invalid response from chat API.");
    }

    const validStatuses: UnderstandingStatus[] = [
        "not_assessed",
        "developing",
        "understood",
        "misunderstood",
    ];

    // check every assessment in the array
    // .every() returns true only when every element satisfies the conditions
    const validAssessments = data.assessments.every(
        (item): item is ConceptAssessment =>
            typeof item === "object" &&
            item !== null &&
            "concept" in item &&
            typeof item.concept === "string" &&
            "status" in item &&
            typeof item.status === "string" &&
            validStatuses.some((status) => status === item.status) &&
            "explanation" in item &&
            typeof item.explanation === "string"
    );

    if (!validAssessments) {
        throw new Error("Invalid concept assessments from chat API.");
    }

    return {
        reply: data.reply,
        assessments: data.assessments,
    };
}