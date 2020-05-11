import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

import { ArtifactRelationshipComponent } from './artifact-relationship.component';
import { RelationshipService } from '../../services/relationship.service';
import { relationships } from '../test.data';


describe('ArtifactRelationshipComponent', () => {
  let fixture: ComponentFixture<ArtifactRelationshipComponent>;
  let relationshipService: RelationshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtifactRelationshipComponent],
      providers: [
        RelationshipService
      ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ToastrModule.forRoot({}),
      ],
      // This is used to avoid having to import components we don't test here
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    relationshipService = TestBed.get(RelationshipService);
  });

});
