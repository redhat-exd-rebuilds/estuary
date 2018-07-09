interface StoryMetaAPI {
    requested_node_index: Number;
    story_related_nodes_backward: Array<Number>;
    story_related_nodes_forward: Array<Number>;
}

export interface StoryAPI {
    data: Array<any>;
    meta: StoryMetaAPI;
}
