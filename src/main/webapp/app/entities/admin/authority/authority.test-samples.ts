import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'd1c884a4-66aa-49dc-aa23-a062918e5041',
};

export const sampleWithPartialData: IAuthority = {
  name: '0f716665-c665-458f-8d3d-68072a7ce099',
};

export const sampleWithFullData: IAuthority = {
  name: '3e409ac7-4bbc-4b1f-9b48-e8eabe75c6b8',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
