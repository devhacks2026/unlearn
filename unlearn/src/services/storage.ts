// creating this localStorage in src and not server because...
// localStorage is a browser API!

// import shared TypeScript type we created for channels
import type { Channel } from "../types/study";

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