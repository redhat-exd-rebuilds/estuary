import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { RecentsService } from '../services/recents.service';
import { recents } from '../recents/test.data';


describe('RecentsService testing', () => {
    let httpTestingController: HttpTestingController;
    let recentsService: RecentsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [RecentsService]
      });

      httpTestingController = TestBed.inject(HttpTestingController);
      recentsService = TestBed.inject(RecentsService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('can get the recent artifacts', () => {

      recentsService.getRecents().subscribe(data => {
          expect(data).toEqual(recents);
      });

      const req = httpTestingController.expectOne(`${recentsService.apiUrl}recents`);
      expect(req.request.method).toEqual('GET');
      req.flush(recents);
    });
});
