import { ITaskBodyParser, IBoardBodyParser, IUserBodyParser } from '../common/interfaces';

export type BodyParser = ITaskBodyParser & IBoardBodyParser & IUserBodyParser;

export const hidePass = (body: BodyParser): BodyParser =>
  body.password !== undefined ? { ...body, password: '*****' } : body;
