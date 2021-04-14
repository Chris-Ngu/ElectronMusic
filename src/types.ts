export interface Song {
    path: string,
    name: string,
    id: number
};

export interface OpenDialog {
    path?: string,
    files?: string[]
    error?: string
};

export const SOURCE = "Source";
export const DESTINATION = "Destination";
export const OPENFILEDIALOGERROR = "No directory selected";