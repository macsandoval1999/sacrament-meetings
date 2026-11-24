// Create an interface to represent a hymn
// NOTE: An interface is used to define the shape of an object, specifying the properties and their types.
export interface Hymn {
    id: number;
    title: string;
}

// This interface represents the data required to create or update a hymn.
export interface HymnInput {
    id: number;
    title: string;
}

// This interface represents the form input for creating or updating a hymn.
export interface HymnFormInput {
    id: string;
    title: string;
}

// This interface represents the state of the hymn form.
export interface HymnFormState {
    message: string;
    errors: Partial<Record<keyof HymnFormInput, string[]>>;
}
