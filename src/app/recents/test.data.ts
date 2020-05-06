export const recents = {
    'data': {
        'Advisory': [
            {
                'advisory_name': null,
                'update_date': '2017-05-30T11:44:38+00:00',
                'issue_date': null,
                'created_at': null,
                'state': null,
                'product_short_name': null,
                'product_name': null,
                'content_types': null,
                'security_sla': null,
                'synopsis': null,
                'security_impact': null,
                'status_time': null,
                'actual_ship_date': null,
                'release_date': null,
                'id': '66666',
                'resource_type': 'Advisory'
            }
        ],
        'DistGitCommit': [
            {
                'log_message': null,
                'author_date': null,
                'hash': '55555',
                'commit_date': '2017-05-02T11:44:38+00:00',
                'resource_type': 'DistGitCommit',
                'repos': [{'name': 'python', 'namespace': 'rpms'}]
            }
        ],
        'FreshmakerEvent': [
            {
                'state_reason': null,
                'state_name': null,
                'id': '77777',
                'state': null,
                'event_type_id': null,
                'message_id': null,
                'resource_type': 'FreshmakerEvent'
            }
        ],
        'KojiBuild': [
            {
                'name': null,
                'start_time': null,
                'creation_time': null,
                'state': null,
                'completion_time': '2017-05-27T11:44:38+00:00',
                'epoch': null,
                'version': null,
                'release': null,
                'id': '44444',
                'resource_type': 'KojiBuild'
            }
        ],
        'BugzillaBug': [
            {
                'status': null,
                'votes': null,
                'severity': null,
                'classification': null,
                'resolution': null,
                'product_version': null,
                'creation_time': null,
                'modified_time': '2017-06-26T11:44:38+00:00',
                'product_name': null,
                'priority': null,
                'short_description': null,
                'target_milestone': null,
                'id': '22222',
                'resource_type': 'BugzillaBug'
            },
            {
                'status': null,
                'votes': null,
                'severity': null,
                'classification': null,
                'resolution': null,
                'product_version': null,
                'creation_time': null,
                'modified_time': '2017-05-26T11:44:38+00:00',
                'product_name': null,
                'priority': null,
                'short_description': null,
                'target_milestone': null,
                'id': '33333',
                'resource_type': 'BugzillaBug'
            },
            {
                'status': null,
                'votes': null,
                'severity': null,
                'classification': null,
                'resolution': null,
                'product_version': null,
                'creation_time': null,
                'modified_time': '2017-04-26T11:44:38+00:00',
                'product_name': null,
                'priority': null,
                'short_description': null,
                'target_milestone': null,
                'id': '11111',
                'resource_type': 'BugzillaBug'
            }
        ]
    },
    'metadata': {
        'id_dict': {
            'FreshmakerEvent': 'id',
            'BugzillaBug': 'id',
            'DistGitCommit': 'hash',
            'KojiBuild': 'id',
            'Advisory': 'id'
        },
        'timestamp_dict': {
            'FreshmakerEvent': 'id',
            'BugzillaBug': 'modified_time',
            'DistGitCommit': 'commit_date',
            'KojiBuild': 'completion_time',
            'Advisory': 'update_date'
        }
    }
};
