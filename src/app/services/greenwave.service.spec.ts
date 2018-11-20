import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GreenwaveService } from './greenwave.service';
import { GreenwaveDecision } from '../models/greenwave.type';


describe('GreenwaveService testing', () => {
  let httpTestingController: HttpTestingController;
  let greenwaveService: GreenwaveService;
  let greenwaveDecision: GreenwaveDecision;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GreenwaveService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    greenwaveService = TestBed.get(GreenwaveService);

    greenwaveDecision = {
      applicable_policies: [],
      policies_satisfied: true,
      results: [],
      satisfied_requirements: [],
      summary: 'Some summary',
      unsatisfied_requirements: [],
      waivers: [],
    };
  });

  it('can get the Greenwave decision', () => {
    const testData = {
      'applicable_policies': [
        'cvp-default'
      ],
      'policies_satisfied': true,
      'results': [],
      'satisfied_requirements': [],
      'summary': 'All required tests passed',
      'unsatisfied_requirements': [],
      'waivers': []
    };

    greenwaveService.getDecision('some-continaer', 'cvp_default', 'cvp', 'koji_build').subscribe(data => {
        expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(`${greenwaveService.greenwaveURL}decision`);
    expect(req.request.method).toEqual('POST');
    req.flush(testData);
  });

  it('can parse the RHEL version from an NVR', () => {
    expect(greenwaveService.getProductVersionFromNVR('yum-utils-1.1.31-46.el7_5')).toBe('rhel-7');
  });

  it('errors when parsing an invalid NVR', () => {
    // Use a try/catch instead of Jasmine's `toThrowError` since Babel seems to modify the error in
    // such a way that Jasmine doesn't catch it.
    try {
      greenwaveService.getProductVersionFromNVR('yum');
      throw new Error('No error');
    } catch (error) {
      expect(error.message).toBe('The product version could not be determined from the NVR');
    }
  });

  it('gets a "Passing" status name from a decision', () => {
    const statusName = greenwaveService.getStatusName(greenwaveDecision);
    expect(statusName).toBe('Passed');
  });

  it('gets a "Warning" status name from a decision', () => {
    greenwaveDecision.waivers = [{waived: true}];
    const statusName = greenwaveService.getStatusName(greenwaveDecision);
    expect(statusName).toBe('Warning');
  });

  it('gets a "Failed" status name from a decision', () => {
    greenwaveDecision.policies_satisfied = false;
    const statusName = greenwaveService.getStatusName(greenwaveDecision);
    expect(statusName).toBe('Failed');
  });
});
