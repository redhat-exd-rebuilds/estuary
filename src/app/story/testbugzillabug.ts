export let bug = {
    'assignee': {
      'email': 'user1@redhat.com',
      'name': null,
      'username': 'user1'
    },
    'attached_advisories': [
      {
        'actual_ship_date': '2018-03-26T20:05:43+00:00',
        'advisory_name': 'RHSA-2018:1234-01',
        'content_types': [
          'docker'
        ],
        'created_at': '2018-03-20T14:11:06+00:00',
        'id': '123456',
        'issue_date': '2018-03-26T18:50:38+00:00',
        'product_name': 'Red Hat Enterprise Linux',
        'product_short_name': 'RHEL',
        'release_date': null,
        'security_impact': 'Important',
        'security_sla': '2018-03-24T00:00:00+00:00',
        'state': 'SHIPPED_LIVE',
        'status_time': '2018-03-26T20:05:43+00:00',
        'synopsis': 'Important: RPM security update',
        'type': null,
        'update_date': '2018-03-26T18:50:38+00:00',
        'updated_at': '2018-03-26T20:35:45+00:00'
      }
    ],
    'classification': 'Red Hat',
    'creation_time': '2018-03-05T20:29:03+00:00',
    'id': '23456',
    'modified_time': '2018-03-26T15:53:52+00:00',
    'priority': 'high',
    'product_name': 'Red Hat Enterprise Linux 7',
    'product_version': '7.4',
    'qa_contact': {
      'email': 'user2@redhat.com',
      'name': null,
      'username': 'user2'
    },
    'related_by_commits': [],
    'reporter': {
      'email': 'user3@redhat.com',
      'name': null,
      'username': 'user3'
    },
    'resolution': 'ERRATA',
    'resolved_by_commits': [
      {
        'author_date': '2018-03-19T15:11:35+00:00',
        'commit_date': '2018-03-20T12:50:00+00:00',
        'hash': '84fbdcd24e5bc23ddcb59845bbbff11b247dbda7',
        'log_message': 'Some log message'
      }
    ],
    'resource_type': 'BugzillaBug',
    'reverted_by_commits': [],
    'severity': 'high',
    'short_description': 'Some description',
    'status': 'CLOSED',
    'target_milestone': 'rc',
    'votes': 0
};
