interface StoryMetaAPI {
    related_nodes: Array<any>;
}

export interface StoryAPI {
    data: Array<any>;
    meta: StoryMetaAPI;
}
