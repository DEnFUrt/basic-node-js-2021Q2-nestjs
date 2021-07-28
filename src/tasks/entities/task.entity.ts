import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  title = 'Title Task';

  @Column('smallint')
  order = 0;

  @Column('varchar', { length: 1000 })
  description = 'Task description';

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  user!: User;

  @Column('uuid', { nullable: true })
  userId!: string | null;

  @ManyToOne(() => Board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  board!: Board;

  @Column('uuid', { nullable: true })
  boardId!: string | null;

  @Column('uuid', { nullable: true })
  columnId!: string | null;
}
