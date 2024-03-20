import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'a31a9dad-981f-4fab-9901-eef64cac463b',
};

export const sampleWithPartialData: IAuthority = {
  name: '986483f6-b015-44a2-98e7-356070a531dc',
};

export const sampleWithFullData: IAuthority = {
  name: '367cd4e6-6455-4a69-a0c2-fce7d6aa6200',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
