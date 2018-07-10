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

      httpTestingController = TestBed.get(HttpTestingController);
      siblingsService = TestBed.get(SiblingsService);
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
      siblingsService.getSiblings(resource, uid, false).subscribe(data => {
          expect(data).toEqual(testData);
      });

      const req = httpTestingController.expectOne(`${siblingsService.apiUrl}siblings/${resource}/${uid}?reverse=false`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });
});
