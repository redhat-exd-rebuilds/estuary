interface StoryMetaAPI {
    requested_node_index: number;
    story_related_nodes_backward: Array<number>;
    story_related_nodes_forward: Array<number>;
    story_type: string;
    total_lead_time: number;
    total_processing_time: number;
    total_wait_time: number;
    processing_time_flag: boolean;
    wait_times: Array<number>;
}

export interface StoryAPI {
    data: Array<any>;
    meta: StoryMetaAPI;
}
