import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Columns } from './column.entity';
// import { Task } from './task';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  title = 'Title Board';

  @OneToMany(() => Columns, (columns) => columns.board, {
    nullable: true,
    cascade: true,
  })
  columns!: Columns[];

  /*   @OneToMany(() => Task, (tasks) => tasks.board, {
    eager: true,
  })
  tasks!: Task[]; */
}
