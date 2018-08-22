import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RelationshipService } from './relationship.service';
import { relationships } from '../story/test.data';


describe('RelationshipService testing', () => {
    let httpTestingController: HttpTestingController;
    let relationshipService: RelationshipService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [RelationshipService]
      });

      httpTestingController = TestBed.get(HttpTestingController);
      relationshipService = TestBed.get(RelationshipService);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('can get the tags of a build', () => {
      relationshipService.getRelatedArtifacts('kojibuild', '3456', 'tags').subscribe(data => {
        expect(data).toEqual(relationships);
      });

      const req = httpTestingController.expectOne(`${relationshipService.apiUrl}relationships/kojibuild/3456/tags`);
      expect(req.request.method).toEqual('GET');
      req.flush(relationships);
    });
});

