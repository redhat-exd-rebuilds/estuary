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

export let story = {
  'data': [
    {
      'assignee': null,
        'attached_advisories': [],
        'classification': 'Red Hat',
        'creation_time': '2017-04-02T19:39:06+00:00',
        'id': '12345',
        'modified_time': '2018-02-07T19:30:47+00:00',
        'priority': 'high',
        'product_name': 'Red Hat Enterprise Linux',
        'product_version': '7.5',
        'qa_contact': null,
        'related_by_commits': [],
        'reporter': null,
        'resolution': '',
        'resolved_by_commits': [{
          'author_date': '2017-04-26T11:44:38+00:00',
          'commit_date': '2017-04-26T11:44:38+00:00',
          'hash': '8a63adb248ba633e200067e1ad6dc61931727bad',
          'log_message': 'Related: #12345 - fix xyz'
        }],
        'resource_type': 'BugzillaBug',
        'reverted_by_commits': [],
        'severity': 'low',
        'short_description': 'Some description',
        'status': 'VERIFIED',
        'target_milestone': 'rc',
        'votes': 0
    },
    {
      'author_date': '2017-04-26T11:44:38+00:00',
      'commit_date': '2017-04-26T11:44:38+00:00',
      'hash': '8a63adb248ba633e200067e1ad6dc61931727bad',
      'log_message': 'Related: #12345 - fix xyz',
      'resource_type': 'DistGitCommit'
    },
    {
      'completion_time': '2017-04-02T19:39:06+00:00',
      'creation_time': '2017-04-02T19:39:06+00:00',
      'epoch': '0',
      'extra': null,
      'id': '2345',
      'name': 'slf4j',
      'release': '4.el7_4',
      'resource_type': 'KojiBuild',
      'start_time': '2017-04-02T19:39:06+00:00',
      'state': 1,
      'version': '1.7.4'
    },
    {
      'actual_ship_date': '2017-08-01T15:43:51+00:00',
      'advisory_name': 'RHBA-2017:2251-02',
      'content_types': ['docker'],
      'created_at': '2017-04-03T14:47:23+00:00',
      'id': '27825',
      'issue_date': '2017-08-01T05:59:34+00:00',
      'product_name': 'Red Hat Enterprise Linux',
      'product_short_name': 'RHEL',
      'release_date': null,
      'resource_type': 'Advisory',
      'security_impact': 'None',
      'security_sla': null,
      'state': 'SHIPPED_LIVE',
      'status_time': '2017-08-01T15:43:51+00:00',
      'synopsis': 'cifs-utils bug fix update',
      'type': 'RHBA',
      'update_date': '2017-08-01T07:16:00+00:00',
      'updated_at': '2017-08-01T15:43:51+00:00'
    },
    {
      'event_type_id': 8,
      'id': '1180',
      'message_id': 'ID:messaging-devops-broker01.test',
      'resource_type': 'FreshmakerEvent',
      'state': 2,
      'state_name': 'COMPLETE',
      'state_reason': 'All container images have been rebuilt.',
      'url': '/api/1/events/1180'
    },
    {
      'completion_time': '2018-05-08T19:17:42+00:00',
      'creation_time': '2018-05-08T19:17:44.180482+00:00',
      'epoch': null,
      'id': '687618',
      'name': 'rh-perl520-docker',
      'original_nvr': null,
      'release': '17.1525804575',
      'resource_type': 'ContainerKojiBuild',
      'start_time': '2018-05-08T18:56:25+00:00',
      'state': 1,
      'version': '5.20'
    }
  ],
  'meta': {
    'requested_node_index': 0,
    'story_related_nodes_backward': [0, 0, 0, 0, 0, 0],
    'story_related_nodes_forward': [1, 0, 0, 0, 0, 0]
  }
};
