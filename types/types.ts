type initialResponse = {
    files: string[],
    path: string
};

type paths = {
    source: string,
    destination: string,
    songPath: string,
    songName: string,
    sourceOrDestination: string
};

type renameArg = {
    originalPath: string,
    modifiedPath: string,
    reason: "rename"
};

type deleteArg = {
    song: string,
    reason: "delete"
};

type moveArg = {
    from: string,
    to: string,
    reason: "move"
};

type historyItem = {
    reason: string,
    song: string,
    originalPath?: string,
    modifiedPath?: string,
    to?: string,
    from?: string
};

type rightClick = {
    x: number,
    y: number;
};

type createHistoryType = ["move", "rename", "delete"];

type error = {
    error: string
};

type fillType = "source" | "destination";

// Please change this
type errors = "No errors so far";

export { initialResponse, paths, renameArg, errors, moveArg, createHistoryType, historyItem, error, deleteArg, rightClick, fillType };