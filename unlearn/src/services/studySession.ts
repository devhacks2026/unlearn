import type { Message } from "../types/study";
import { getChannels, getMessages, addMessage } from "./storage";
import { sendMessage } from "./chatApi";

export async function sendStudyMessage(
    channelId: string,
    text: string
): Promise<Message> {
    // check that the message is valid
    const trimmedText = text.trim();

    if (!trimmedText || trimmedText.length > 5000) {
        throw new Error("Message must contain 1-5000 characters. Not empty and not too many. Gotta save those tokens.");
    }

    // check that the channel exists
    const channel = getChannels().find(
        (channel) => channel.id === channelId
    );

    if (!channel) {
        throw new Error("Study channel not found. :(");
    }

    // load the previous messages in the channel for history
    const history = getMessages(channelId);

    // create the student's message object containing trimmed text
    const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmedText,
        createdAt: new Date().toISOString(),
    };

    // save student's new message
    addMessage(channelId, userMessage);

    // send previous history and new message to gemini
    // remember --> restrict to only 40 messages back
    const recentHistory = history.slice(-40);
    const reply = await sendMessage(trimmedText, recentHistory);

    // create gemini's response message object
    const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        // convert Date object into standardized string using ISO format
        createdAt: new Date().toISOString(),
    };

    // save gemini's response message
    addMessage(channelId, assistantMessage);

    // return the response to the UI
    return assistantMessage;
}