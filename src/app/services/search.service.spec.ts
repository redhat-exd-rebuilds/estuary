import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SearchService } from '../services/search.service';


describe('HttpClient testing', () => {
    let httpTestingController: HttpTestingController;
    let searchService: SearchService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [SearchService]
      });

      httpTestingController = TestBed.get(HttpTestingController);
      searchService = TestBed.get(SearchService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('can get the artifact types', () => {
      const testData = {
        typeOne: 'id',
        typeTwo: 'id',
        typeThree: 'id',
        typeFour: 'hash',
        typeFive: 'id',
        typeSix: 'id'
      };

      searchService.getAvailableResources().subscribe(data => {
          expect(data).toEqual(testData);
      });

      const req = httpTestingController.expectOne(`${searchService.apiUrl}story`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });
});
