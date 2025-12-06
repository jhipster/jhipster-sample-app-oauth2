import { TestBed } from '@angular/core/testing';

import { ParseLinks } from './parse-links.service';

describe('Parse links service test', () => {
  let service: ParseLinks;

  beforeEach(() => {
    service = TestBed.inject(ParseLinks);
  });

  describe('parse', () => {
    it('should throw an error when passed an empty string', () => {
      expect(function () {
        service.parse('');
      }).toThrow(new Error('input must not be of zero length'));
    });

    it('should throw an error when passed without comma', () => {
      expect(function () {
        service.parse('test');
      }).toThrow(new Error('section could not be split on ";"'));
    });

    it('should throw an error when passed without semicolon', () => {
      expect(function () {
        service.parse('test,test2');
      }).toThrow(new Error('section could not be split on ";"'));
    });

    it('should return links when headers are passed', () => {
      const links = { last: 0, first: 0 };
      expect(service.parse(' </api/audits?page=0&size=20>; rel="last",</api/audits?page=0&size=20>; rel="first"')).toEqual(links);
    });
  });
  describe('parseAll', () => {
    it('should throw an error when passed an empty string', () => {
      expect(function () {
        service.parseAll('');
      }).toThrow(new Error('input must not be of zero length'));
    });

    it('should throw an error when passed without comma', () => {
      expect(function () {
        service.parseAll('test');
      }).toThrow(new Error('section could not be split on ";"'));
    });

    it('should throw an error when passed without semicolon', () => {
      expect(function () {
        service.parseAll('test,test2');
      }).toThrow(new Error('section could not be split on ";"'));
    });

    it('should return links when headers are passed', () => {
      const links = { last: { page: '0', size: '20' }, first: { page: '0', size: '20' } };
      expect(service.parseAll(' </api/audits?page=0&size=20>; rel="last",</api/audits?page=0&size=20>; rel="first"')).toEqual(links);
    });
  });
});
