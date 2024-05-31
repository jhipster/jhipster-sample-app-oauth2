import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 'a2961fd1-f606-4197-b2c8-8f86bce60b1c',
  login: '2uZ',
};

export const sampleWithPartialData: IUser = {
  id: 'dec490f7-68cf-48f2-a494-2183f6656442',
  login: 'Wy',
};

export const sampleWithFullData: IUser = {
  id: '7243a187-0282-4edd-8c73-bd0799c33c8f',
  login: 'SnF@cqO\\mF\\3Y8O\\TDrh\\]84\\Q1eEHQS',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
