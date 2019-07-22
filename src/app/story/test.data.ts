import { GreenwaveDecision } from '../models/greenwave.type';


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
    'display_name': 'RHBZ#23456',
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
        'display_name': 'RHBZ#12345',
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
        'votes': 0,
        'timeline_timestamp': '2018-12-10T12:01:21Z',
    },
    {
      'author_date': '2017-04-26T11:44:38+00:00',
      'commit_date': '2017-04-26T11:44:38+00:00',
      'hash': '8a63adb248ba633e200067e1ad6dc61931727bad',
      'log_message': 'Related: #12345 - fix xyz',
      'display_name': 'commit #8a63adb',
      'resource_type': 'DistGitCommit',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
    },
    {
      'completion_time': '2017-04-02T19:39:06+00:00',
      'creation_time': '2017-04-02T19:39:06+00:00',
      'epoch': '0',
      'extra': null,
      'id': '2345',
      'name': 'slf4j',
      'release': '4.el7_4',
      'display_name': 'slf4j-1.7.4-4.el7_4',
      'resource_type': 'KojiBuild',
      'start_time': '2017-04-02T19:39:06+00:00',
      'state': 1,
      'version': '1.7.4',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
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
      'display_name': 'RHBA-2017:2251-02',
      'security_impact': 'None',
      'security_sla': null,
      'state': 'SHIPPED_LIVE',
      'status_time': '2017-08-01T15:43:51+00:00',
      'synopsis': 'cifs-utils bug fix update',
      'type': 'RHBA',
      'update_date': '2017-08-01T07:16:00+00:00',
      'updated_at': '2017-08-01T15:43:51+00:00',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
    },
    {
      'event_type_id': 8,
      'id': '1180',
      'message_id': 'ID:messaging-devops-broker01.test',
      'display_name': 'Freshmaker event 1180',
      'resource_type': 'FreshmakerEvent',
      'state': 2,
      'state_name': 'COMPLETE',
      'state_reason': 'All container images have been rebuilt.',
      'url': '/api/1/events/1180',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
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
      'display_name': 'rh-perl520-docker-5.20-17.1525804575',
      'start_time': '2018-05-08T18:56:25+00:00',
      'state': 1,
      'version': '5.20',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
    }
  ],
  'meta': {
    'requested_node_index': 0,
    'story_related_nodes_backward': [0, 0, 0, 0, 0, 0],
    'story_related_nodes_forward': [1, 0, 0, 0, 0, 0],
    'story_path': 'container'
  }
};

export let module_story = {
  'data': [
    {
      'author_date': null,
      'commit_date': null,
      'display_name': 'commit #d11fcbf',
      'hash': 'd11fcbf943086c0d55ce35beacaf10ef1f816c5a',
      'log_message': null,
      'resource_type': 'DistGitCommit',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
    },
    {
      'advisories': [],
      'commit': {
        'author_date': null,
        'commit_date': null,
        'hash': 'd11fcbf943086c0d55ce35beacaf10ef1f816c5a',
        'log_message': null
      },
      'completion_time': '2018-08-14T02:04:09.827157+00:00',
      'creation_time': '2018-08-14T01:31:15.583303+00:00',
      'display_name': 'libguestfs-1.38.4-1.el8+1579+44551958',
      'epoch': '1',
      'extra': {'source': {'original_url': 'git://pkgs.devel.redhat.com/rpms/libguestfs?#d11fcbf943086c0d55ce35beacaf10ef1f816c5a'}},
      'id': '750095',
      'module_builds': [
        {
          'id': '755647',
          'mbs_id': 1667,
          'module_name': 'virt',
          'module_stream': 'rhel',
          'module_version': '20180822114445',
          'name': 'virt',
          'release': '20180822114445.9edba152',
          'start_time': '2018-08-22T11:45:20+00:00',
          'state': 1,
          'version': 'rhel'
        }
      ],
      'name': 'libguestfs',
      'owner': {
        'email': null,
        'name': null,
        'username': 'mbs/mbs-backend.host.prod.eng.bos.redhat.com'
      },
      'release': '1.el8+1579+44551958',
      'resource_type': 'KojiBuild',
      'start_time': '2018-08-14T01:31:15.583303+00:00',
      'state': 1,
      'tags': [
        {
          'id': '17224',
          'name': 'module-virt-rhel-20180822114445-9edba152-build'
        },
        {
          'id': '17223',
          'name': 'module-virt-rhel-20180822114445-9edba152'
        },
        {
          'id': '17210',
          'name': 'module-virt-rhel-20180821132937-9edba152-build'
        },
        {
          'id': '17209',
          'name': 'module-virt-rhel-20180821132937-9edba152'
        },
        {
          'id': '17177',
          'name': 'module-virt-rhel-20180817161005-9edba152-build'
        },
        {
          'id': '17176',
          'name': 'module-virt-rhel-20180817161005-9edba152'
        },
        {
          'id': '17153',
          'name': 'module-virt-rhel-20180816163147-9edba152-build'
        },
        {
          'id': '17152',
          'name': 'module-virt-rhel-20180816163147-9edba152'
        },
        {
          'id': '17112',
          'name': 'module-virt-rhel-20180816084153-9edba152-build'
        },
        {
          'id': '17111',
          'name': 'module-virt-rhel-20180816084153-9edba152'
        },
        {
          'id': '17109',
          'name': 'module-virt-rhel-20180816080957-9edba152-build'
        },
        {
          'id': '17108',
          'name': 'module-virt-rhel-20180816080957-9edba152'
        },
        {
          'id': '17025',
          'name': 'module-virt-rhel-20180814142623-9edba152-build'
        },
        {
          'id': '17024',
          'name': 'module-virt-rhel-20180814142623-9edba152'
        },
        {
          'id': '16991',
          'name': 'module-virt-rhel-20180814005649-9edba152-build'
        },
        {
          'id': '16990',
          'name': 'module-virt-rhel-20180814005649-9edba152'
        }
      ],
      'version': '1.38.4',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
    },
    {
      'completion_time': '2018-08-22T12:45:27+00:00',
      'context': '9edba152',
      'creation_time': '2018-08-22T12:45:34.855569+00:00',
      'display_name': 'virt-rhel-20180822114445.9edba152',
      'epoch': null,
      'extra': 'some data',
      'id': '755647',
      'mbs_id': 1667,
      'module_name': 'virt',
      'module_stream': 'rhel',
      'module_version': '20180822114445',
      'name': 'virt',
      'release': '20180822114445.9edba152',
      'resource_type': 'ModuleKojiBuild',
      'start_time': '2018-08-22T11:45:20+00:00',
      'state': 1,
      'version': 'rhel',
      'timeline_timestamp': '2018-12-10T12:01:21Z',
    }
  ],
  'meta': {
    'requested_node_index': 1,
    'story_related_nodes_backward': [0, 0, 0],
    'story_related_nodes_forward': [0, 17, 0],
    'story_type': 'module'
  }
};

export let siblings = {
  'data': [
    {
      'assignee': {
        'email': 'tbrady@redhat.com',
        'name': null,
        'username': 'tbrady'
      },
      'attached_advisories': [
        {
          'actual_ship_date': '2018-05-08T18:32:03+00:00',
          'advisory_name': 'RHSA-2018:1234-07',
          'content_types': [
            'rpm'
          ],
          'created_at': '2018-04-16T12:03:55+00:00',
          'id': '33491',
          'issue_date': '2018-05-08T17:15:15+00:00',
          'product_name': 'Red Hat Enterprise Linux',
          'product_short_name': 'RHEL',
          'release_date': '2018-05-08T00:00:00+00:00',
          'security_impact': 'Important',
          'security_sla': '2018-04-04T00:00:00+00:00',
          'state': 'SHIPPED_LIVE',
          'status_time': '2018-05-09T17:35:52+00:00',
          'synopsis': 'Important: kernel security,bug fix,and enhancement update',
          'type': null,
          'update_date': '2018-05-09T15:32:44+00:00',
          'updated_at': '2018-05-09T17:35:52+00:00'
        }
      ],
      'classification': 'Red Hat',
      'creation_time': '2018-04-13T01:57:40+00:00',
      'id': '1566849',
      'modified_time': '2018-06-19T09:10:31+00:00',
      'priority': 'urgent',
      'product_name': 'Red Hat Enterprise Linux 7',
      'product_version': '7.5',
      'qa_contact': {
        'email': 'qa@redhat.com',
        'name': null,
        'username': 'kernel-qe'
      },
      'related_by_commits': [],
      'reporter': {
        'email': 'user1@redhat.com',
        'name': null,
        'username': 'user1'
      },
      'resolution': 'ERRATA',
      'resolved_by_commits': [
        {
          'author_date': '2018-05-10T23:51:54+00:00',
          'commit_date': '2018-05-10T23:51:54+00:00',
          'hash': 'eacc1bf66aa53b3136ac045ead618e18a6751625',
          'log_message': 'message1'
        },
        {
          'author_date': '2018-05-10T09:32:59+00:00',
          'commit_date': '2018-05-10T09:32:59+00:00',
          'hash': 'dc5d9238ea212c0177176edad82255891a7f942e',
          'log_message': 'message2',
        }
      ],
      'resource_type': 'BugzillaBug',
      'reverted_by_commits': [],
      'severity': 'high',
      'short_description': 'CVE-2018-1234 kernel: some error [rhel-7.5.z]',
      'status': 'CLOSED',
      'target_milestone': 'rc',
      'votes': 0
    },
    {
      'assignee': {
        'email': 'user2@redhat.com',
        'name': null,
        'username': 'user2'
      },
      'attached_advisories': [
        {
          'actual_ship_date': '2018-05-08T18:32:03+00:00',
          'advisory_name': 'RHSA-2018:1318-07',
          'content_types': [
            'rpm'
          ],
          'created_at': '2018-04-16T12:03:55+00:00',
          'id': '33491',
          'issue_date': '2018-05-08T17:15:15+00:00',
          'product_name': 'Red Hat Enterprise Linux',
          'product_short_name': 'RHEL',
          'release_date': '2018-05-08T00:00:00+00:00',
          'security_impact': 'Important',
          'security_sla': '2018-04-04T00:00:00+00:00',
          'state': 'SHIPPED_LIVE',
          'status_time': '2018-05-09T17:35:52+00:00',
          'synopsis': 'Important: kernel security,bug fix,and enhancement update',
          'type': null,
          'update_date': '2018-05-09T15:32:44+00:00',
          'updated_at': '2018-05-09T17:35:52+00:00'
        }
      ],
      'classification': 'Red Hat',
      'creation_time': '2018-04-13T07:57:42+00:00',
      'id': '1567084',
      'modified_time': '2018-06-19T07:34:08+00:00',
      'priority': 'urgent',
      'product_name': 'Red Hat Enterprise Linux 7',
      'product_version': '7.5',
      'qa_contact': {
        'email': 'qa@redhat.com',
        'name': null,
        'username': 'kernel-qe'
      },
      'related_by_commits': [],
      'reporter': {
        'email': 'user2@redhat.com',
        'name': null,
        'username': 'user2'
      },
      'resolution': 'ERRATA',
      'resolved_by_commits': [
        {
          'author_date': '2018-05-10T23:51:54+00:00',
          'commit_date': '2018-05-10T23:51:54+00:00',
          'hash': 'eacc1bf66aa53b3136ac045ead618e18a6751625',
          'log_message': 'message1'
        },
        {
          'author_date': '2018-05-10T09:32:59+00:00',
          'commit_date': '2018-05-10T09:32:59+00:00',
          'hash': 'dc5d9238ea212c0177176edad82255891a7f942e',
          'log_message': 'message3'
        }
      ],
      'resource_type': 'BugzillaBug',
      'reverted_by_commits': [],
      'severity': 'medium',
      'short_description': 'CVE-2018-1235 kernel: some really long error that is hard to fix and causes problems [rhel-7.5.z]',
      'status': 'CLOSED',
      'target_milestone': 'rc',
      'votes': 0
    }
  ],
  'meta': {
    'description': 'Bugzilla bugs resolved by commit #eacc1bf66aa53b3136ac045ead618e18a6751625'
  }
};

export const relationships = {
  'data': [
    {
      'builds': [],
      'display_name': 'rhscl-12345-candidate',
      'id': '1234',
      'module_builds': null,
      'name': 'rhscl-12345-candidate',
      'resource_type': 'KojiTag'
    },
    {
      'builds': [],
      'display_name': 'rhscl-23456-candidate',
      'id': '2345',
      'module_builds': null,
      'name': 'rhscl-23456-candidate',
      'resource_type': 'KojiTag'
    },
  ],
  'meta': {
    'description': 'Tags of rh-some20-docker-16.23-17.12345'
  }
};

export const greenwaveDecision: GreenwaveDecision = {
  'applicable_policies': [
    'cvp-default'
  ],
  'policies_satisfied': true,
  'results': [
    {
      'data': {
        'item': [
          'cfme-openshift-app-ui-container-5.9.3.4-1.1533127933'
        ],
        'log': [
          'https://jenkins.domain.local/job/cvp-product-test/1/console'
        ],
      },
      'groups': [
        'f79f00c2-e0be-4782-8613-7d1b7fa7b6d6'
      ],
      'href': 'https://resultsdb.domain.local/api/v2.0/results/6125427',
      'id': 6125427,
      'note': '',
      'outcome': 'INFO',
      'ref_url': 'https://jenkins.domain.local/job/cvp-product-test/1/',
      'submit_time': '2018-08-01T19:07:05.442807',
      'testcase': {
        'href': 'https://resultsdb.domain.local/api/v2.0/testcases/rhproduct.default.functional',
        'name': 'rhproduct.default.functional',
        'ref_url': 'https://jenkins.domain.local/'
      }
    },
    {
      'data': {
        'item': [
          'cfme-openshift-app-ui-container-5.9.3.4-1.1533127933'
        ],
        'log': [
          'https://jenkins.domain.local/job/cvp-product-test/1/console'
        ],
      },
      'groups': [
        'b6d8bbeb-a7ea-4bc3-b062-25eb8f404b2e'
      ],
      'href': 'https://resultsdb.domain.local/api/v2.0/results/6125318',
      'id': 6125318,
      'note': '',
      'outcome': 'PASSED',
      'ref_url': 'https://jenkins.domain.local/job/cvp-product-test/1/',
      'submit_time': '2018-08-01T19:03:49.074767',
      'testcase': {
        'href': 'https://resultsdb.domain.local/api/v2.0/testcases/rhproduct.default.sanity',
        'name': 'rhproduct.default.sanity',
        'ref_url': 'https://jenkins.domain.local/'
      }
    },
    {
      'data': {
        'item': [
          'cfme-openshift-app-ui-container-5.9.3.4-1.1533127933'
        ],
        'log': [
          'https://jenkins.domain.local/job/cvp-product-test/1/console'
        ],
      },
      'groups': [
        'b6d8bbeb-a7ea-4bc3-b062-25eb8f404b2e'
      ],
      'href': 'https://resultsdb.domain.local/api/v2.0/results/6125319',
      'id': 6125319,
      'note': '',
      'outcome': 'PASSED',
      'ref_url': 'https://jenkins.domain.local/job/cvp-product-test/1/',
      'submit_time': '2018-08-01T19:04:49.074767',
      'testcase': {
        'href': 'https://resultsdb.domain.local/api/v2.0/testcases/rhproduct.default.sanity',
        'name': 'rhproduct.default.sanity',
        'ref_url': 'https://jenkins.domain.local/'
      }
    }
  ],
  'satisfied_requirements': [
    {
      'result_id': 6125319,
      'testcase': 'rhproduct.default.sanity',
      'type': 'test-result-passed'
    },
    {
      'result_id': 6125427,
      'testcase': 'rhproduct.default.functional',
      'type': 'test-result-passed'
    }
  ],
  'summary': 'All required tests passed',
  'unsatisfied_requirements': [],
  'waivers': []
};
