import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'dc8a6a9c-2a69-4854-abf1-65658dd87ac0',
};

export const sampleWithPartialData: IAuthority = {
  name: '349c4bbf-4eeb-47cb-85e0-2fe12596b407',
};

export const sampleWithFullData: IAuthority = {
  name: 'd97ef375-1a14-47fa-bc7f-c36eb0ee323e',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
