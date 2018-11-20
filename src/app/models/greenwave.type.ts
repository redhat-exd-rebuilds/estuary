import { IconDefinition } from '@fortawesome/free-solid-svg-icons';


// This is used to store the gating status in the component and doesn't reflect
// the Greenwave API
export interface GatingStatus {
    icon: IconDefinition;
    iconClass: string;
    loading: boolean;
    summary: string;
    statusName: string;
}

export interface GreenwaveDecision {
    applicable_policies: Array<string>;
    policies_satisfied: boolean;
    results: Array<any>;
    satisfied_requirements: Array<any>;
    summary: string;
    unsatisfied_requirements: Array<any>;
    waivers: Array<any>;
}
