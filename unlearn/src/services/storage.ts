// creating this localStorage in src and not server because...
// localStorage is a browser API!

// import shared TypeScript type we created for channels
import type { Channel, Message } from "../types/study";
import type { ConceptAssessment } from "./chatApi";

// key to identify app's data in localStorage
// localStorage stores data using key-value pairs
const STORAGE_KEY = "unlearn_channels";

// get all saved channels from localStorage
export function getChannels(): Channel[] {
    try {
        // retrieve saved data
        const savedData = localStorage.getItem(STORAGE_KEY);

        // if no saved data exists, return an empty array
        if (!savedData) {
            return [];
        }

        // otherwise parse the saved data as an array of channels
        return JSON.parse(savedData) as Channel[];
    } catch (error) {
        console.error("Failed to load channels:", error);
        return [];
    }
}

// save all channels to localStorage
export function saveChannels(channels: Channel[]): void {
    // saves string in the browser under our storage key
    localStorage.setItem(
        STORAGE_KEY,
        // convert JS array into JSON string
        JSON.stringify(channels)
    );
}

// function parameters accepts name of subject and subject description (for additional info)
export function createChannel(
    name: string,
    description: string
): Channel {                                    // return type specified as Channel object
    const newChannel: Channel = {
        // generate a unique id for the new channel
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        // add timestamp (for sorting channels by creation date)
        createdAt: new Date().toISOString(),
        // start with empty arrays since the channel was just created
        messages: [],
        concepts: [],
    };

    // preserve the existing channels by retrieving them
    const channels = getChannels();

    // add the new channel to the existing channels array before saving to localStorage
    saveChannels([...channels, newChannel]);

    // return the newly created channel object
    return newChannel;
}

// before adding message, also make sure one of the parameters is the channel id
export function addMessage(
    channelId: string,
    message: Message
): void {
    const channels = getChannels();

    // find the channel by its id
    const channelExists = channels.some(
        (channel) => channel.id === channelId
    );

    // if the channel does not exist, throw an error
    if (!channelExists) {
        throw new Error("Channel not found! :(");
    }

    // otherwise, update the channel by adding that message
    const updatedChannels = channels.map((channel) => {
        if (channel.id === channelId) {
            return {
                ...channel,
                messages: [...channel.messages, message],
            };
        }

        return channel;
    });

    saveChannels(updatedChannels);
}

export function getMessages(channelId: string): Message[] {
    // retrieve all channels from localStorage
    const channels = getChannels();

    // find the channel by its id
    const channel = channels.find(
        (channel) => channel.id === channelId
    );

    // channel?.messages means access messages if channel exists
    // ?? [] means if messages array exists, return it. otherwise empty array
    return channel?.messages ?? [];
}

// save the assessments to the concept
export function updateConcepts(
    channelId: string,
    assessments: ConceptAssessment[]
): void {
    // retrieve all saved channels from localStorage
    const channels = getChannels();

    // .findIndex() searches for concept matching assessment's name
    // returns index of matching concept or -1 if concept doesn't exist
    const channelExists = channels.some(
        (channel) => channel.id === channelId
    );

    if (!channelExists) {
        throw new Error("Channel not found.");
    }

    // create new array of updated channels with the new assessments applied to the concepts
    const updatedChannels = channels.map((channel) => {
        // if the channel is not the one we are updating, return it as is
        if (channel.id !== channelId) {
            return channel;
        }

        // otherwise, this is the channel we are updating
        const updatedConcepts = [...channel.concepts];

        // iterate over each assessment and update the corresponding concept in the channel
        for (const assessment of assessments) {
            // search for existing concept
            const existingIndex = updatedConcepts.findIndex(
                (concept) =>
                    concept.name.toLowerCase() ===
                    assessment.concept.toLowerCase()
            );

            // if the concept exists, update it; otherwise, add a new concept
            if (existingIndex !== -1) {
                updatedConcepts[existingIndex] = {
                    ...updatedConcepts[existingIndex],
                    status: assessment.status,
                    explanation: assessment.explanation,
                };
            } else {
                updatedConcepts.push({
                    id: crypto.randomUUID(),
                    name: assessment.concept,
                    status: assessment.status,
                    explanation: assessment.explanation,
                });
            }
        }

        return {
            ...channel,
            concepts: updatedConcepts,
        };
    });

    // return new chanel object with updated concepts
    saveChannels(updatedChannels);
}