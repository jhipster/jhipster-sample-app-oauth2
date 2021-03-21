export interface IUser {
  id?: string;
  login?: string;
}

export class User implements IUser {
  constructor(public id: string, public login: string) {}
}

export function getUserIdentifier(user: IUser): string | undefined {
  return user.id;
}
