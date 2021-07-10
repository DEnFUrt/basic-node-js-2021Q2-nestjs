import { ColumnDto } from './column.dto';

export class BoardDto {
  id!: string;
  title!: string;
  columns!: ColumnDto[];
}
