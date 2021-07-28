import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  login!: string;
}

export class UserBody {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  login?: string;

  @ApiProperty()
  password?: string;
}

export class BoardBody {
  @ApiProperty()
  title!: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  columns!: ColumnBody[];
}

export class BoardResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  columns!: ColumnBody[];
}

export class ColumnBody {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  order!: number;
}

export class TaskBody {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: 'string' })
  userId!: string | null;

  @ApiProperty({ type: 'string' })
  boardId!: string | null;

  @ApiProperty({ type: 'string' })
  columnId!: string | null;
}

export class TaskResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: 'string' })
  userId!: string | null;

  @ApiProperty({ type: 'string' })
  boardId!: string | null;

  @ApiProperty({ type: 'string' })
  columnId!: string | null;
}
