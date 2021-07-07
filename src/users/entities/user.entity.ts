import { Entity, PrimaryGeneratedColumn, Column /* OneToMany */ } from 'typeorm';
// import { Task } from './task';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar')
  password = 'P@55w0rd';

  @Column('varchar', { length: 50 })
  name = 'USER';

  @Column('varchar', { length: 50, unique: true })
  login = 'user';
  /* 
  @OneToMany(() => Task, (tasks) => tasks.user, {
    eager: true,
  })
  tasks!: Task[]; */
}

