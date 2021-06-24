import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SiblingsService } from '../services/siblings.service';


describe('SiblingsService testing', () => {
    let httpTestingController: HttpTestingController;
    let siblingsService: SiblingsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [SiblingsService]
      });

      httpTestingController = TestBed.inject(HttpTestingController);
      siblingsService = TestBed.inject(SiblingsService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('can get the siblings of an artifact', () => {
      const testData = [
        {
          'id': '1234',
          'resource_type': 'BugzillaBug'
        },
        {
          'id': '1235',
          'resource_type': 'BugzillaBug'
        }
      ];

      const resource = 'distgitcommit';
      const uid = 'eacc1bf66aa53b3136ac045ead618e18a6751625';
      siblingsService.getSiblings(resource, uid, true, 'container').subscribe(data => {
        expect(data).toEqual(testData);
      });

      const req = httpTestingController.expectOne(
        `${siblingsService.apiUrl}siblings/${resource}/${uid}?story_type=container&backward_rel=true`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });

    it('can get the siblings of an artifact in module story flow', () => {
      const testData = [
        {
          'id': '1234',
          'resource_type': 'KojiBuild'
        },
        {
          'id': '1235',
          'resource_type': 'KojiBuild'
        }
      ];

      const resource = 'modulekojibuild';
      const uid = '1289';
      siblingsService.getSiblings(resource, uid, true, 'module').subscribe(data => {
        expect(data).toEqual(testData);
      });

      const req = httpTestingController.expectOne(
        `${siblingsService.apiUrl}siblings/${resource}/${uid}?story_type=module&backward_rel=true`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });
});
