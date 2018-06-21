interface StoryMetaAPI {
    requested_node_index: Number;
    story_related_nodes: Array<Number>;
}

export interface StoryAPI {
    data: Array<any>;
    meta: StoryMetaAPI;
}
