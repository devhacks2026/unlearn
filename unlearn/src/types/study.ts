// why this file is necessary --> acts as blueprint for app's data!

// concept's understanding is categorized into:
// blue - not assessed
// yellow - developing
// green - understood
// red - misunderstood
export type UnderstandingStatus =
    | "not_assessed"
    | "developing"
    | "understood"
    | "misunderstood";

// interface describes structure of the object
export interface Concept {
    id: string;
    name: string;
    status: UnderstandingStatus;
    // optional: explain why AI assigned that understanding status
    explanation?: string;
}

// interface describes structure of a message in a channel
export interface Message {
    // unique id so react can distinguish messages
    id: string;
    // whether the message came from student or gemini
    role: "user" | "assistant";
    // actual message content
    content: string;
    // when the message was created (ISO timestamps)
    createdAt: string;
}

// channel that connects everything
// contains messages and concepts related to the channel
export interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  messages: Message[];
  concepts: Concept[];
}