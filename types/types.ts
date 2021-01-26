type initialResponse = {
    files: [],
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

type createHistoryType = ["move", "rename", "delete"];

// Please change this
type errors = "No errors so far";

export { initialResponse, paths, renameArg, errors, moveArg, createHistoryType, historyItem };