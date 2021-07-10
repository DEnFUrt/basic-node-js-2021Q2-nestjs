import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { BoardsService } from 'src/boards/boards.service';

type TEntitiesID = { id: string; boardId: string };

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private boardsService: BoardsService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDto> {
    const { boardId } = createTaskDto;
    await this.boardsService.findOne(boardId as string);

    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAllByBoard(boardId: string): Promise<TaskDto[]> {
    return await this.taskRepository.find({ boardId });
  }

  async findOneByBoardId(props: TEntitiesID): Promise<TaskDto | undefined> {
    const task = await this.taskRepository.findOne(props);

    if (task === undefined) {
      throw new NotFoundException();
    }

    return task;
  }

  async update(updateTaskDto: UpdateTaskDto): Promise<TaskDto | undefined> {
    const { id, boardId } = updateTaskDto;
    const props = { id, boardId } as TEntitiesID;

    await this.findOneByBoardId(props);
    return await this.taskRepository.save(updateTaskDto);
  }

  async remove(props: TEntitiesID): Promise<void> {
    const result = await this.taskRepository.delete(props);

    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
