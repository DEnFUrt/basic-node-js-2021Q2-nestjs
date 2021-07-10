import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';

@Controller('boards/:boardId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Body(new JoiValidationPipe(schemas['task'])) createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create({ ...createTaskDto, boardId });
  }

  @Get()
  findAll(@Param('boardId', new ParseUUIDPipe()) boardId: string) {
    return this.tasksService.findAllByBoard(boardId);
  }

  @Get(':id')
  findOne(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.tasksService.findOneByBoardId({ id, boardId });
  }

  @Put(':id')
  update(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(schemas['task'])) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update({ ...updateTaskDto, boardId, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.tasksService.remove({ id, boardId });
  }
}
