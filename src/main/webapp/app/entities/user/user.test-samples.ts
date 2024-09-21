import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 'a91df017-c88b-4e01-9f6c-dc9f6c82928f',
  login: 'Uw@lohDh',
};

export const sampleWithPartialData: IUser = {
  id: 'dc3d793c-f6a7-40ad-877f-8712ed18b572',
  login: 'GJlPo',
};

export const sampleWithFullData: IUser = {
  id: 'ef492233-c7d4-4824-9f66-e19f0b2de525',
  login: 'V',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
