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

});

