interface IUserBodyParser {
  id?: string;
  password: string;
  name: string;
  login: string;
}

interface IColumn {
  id: string;
  title: string;
  order: number;
}

interface IBoardBodyParser {
  id?: string;
  title: string;
  columns: IColumn[];
}

interface ITaskBodyParser {
  id?: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
}

interface IJsonMessage {
  Info?: string;
  Error?: string;
  message?: string;
  method?: string;
  statusCode?: number;
  url?: string;
  ms?: number;
  status?: string;
  stack?: string;
}

export { IUserBodyParser, IColumn, IBoardBodyParser, ITaskBodyParser, IJsonMessage };
