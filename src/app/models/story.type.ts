interface StoryMetaAPI {
    requested_node_index: number;
    story_related_nodes_backward: Array<number>;
    story_related_nodes_forward: Array<number>;
    story_type: string;
}

export interface StoryAPI {
    data: Array<any>;
    meta: StoryMetaAPI;
}
