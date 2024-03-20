import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: '7eae344c-7137-410d-b217-733d408997b1',
  login: 'Vjz@li3\\.v\\u1XqY\\}K3uNAI',
};

export const sampleWithPartialData: IUser = {
  id: '4c29d92b-9fd6-410d-ac6a-35c17e79cfca',
  login: '3h@0i\\tr7Yca\\NK2SA',
};

export const sampleWithFullData: IUser = {
  id: 'cef84fbd-c994-472d-a33a-9059186e80bb',
  login: 'C',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
