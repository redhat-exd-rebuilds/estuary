import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { StoryService } from '../services/story.service';


describe('HttpClient testing', () => {
    let httpTestingController: HttpTestingController;
    let storyService: StoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [StoryService]
      });

      httpTestingController = TestBed.get(HttpTestingController);
      storyService = TestBed.get(StoryService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('can get the story path', () => {
      const testData = {
        'data': [
          {
            'assignee': {
              'email': 'user@redhat.com',
              'name': null,
              'username': 'user'
            },
            'attached_advisories': [],
            'classification': 'Red Hat',
            'creation_time': '2018-03-05T20:29:03+00:00',
            'id': '12345',
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
                'hash': '84fbdcc24e5bc23ddcb59845bbbff11b247caba7',
                'log_message': 'some log message'
              }
            ],
            'resource_type': 'BugzillaBug',
            'reverted_by_commits': [],
            'severity': 'high',
            'short_description': 'some description',
            'status': 'CLOSED',
            'target_milestone': 'rc',
            'votes': 0
          },
          {
            'author_date': '2018-03-19T15:11:35+00:00',
            'commit_date': '2018-03-20T12:50:00+00:00',
            'hash': '84fbdcc24e5bc23ddcb59845bbbff11b247caba7',
            'log_message': 'some log message',
            'resource_type': 'DistGitCommit'
          }
        ],
        'meta': {
          'related_nodes': {
            'Advisory': 0,
            'BugzillaBug': 3,
            'ContainerBuild': 0,
            'DistGitCommit': 0,
            'FreshmakerEvent': 0,
            'KojiBuild': 0
          }
        }
      };

      storyService.getStory('bugzillabug', '12345').subscribe(data => {
          expect(data).toEqual(testData);
      });

      const req = httpTestingController.expectOne(`${storyService.apiUrl}story/bugzillabug/12345`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });
});
