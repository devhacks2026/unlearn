// union type
// tells TS that a concept's understanding status can only be one of these 4 values
export type UnderstandingStatus =
    | "not_assessed"
    | "developing"
    | "understood"
    | "misunderstood";

export interface ConceptAssessment {
    concept: string;
    status: UnderstandingStatus;
    explanation: string;
}

// describe the entire response we want from gemini
export interface TutorResponse {
    reply: string;
    // array of assessments for each concept
    assessments: ConceptAssessment[];
}