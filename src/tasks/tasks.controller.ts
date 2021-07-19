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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('boards/:boardId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body(new JoiValidationPipe(schemas['task'])) createTaskDto: CreateTaskDto,
  ) {
    const result = this.tasksService.create({ ...createTaskDto, boardId });

    if (result === undefined) {
      throw new BadRequestException();
    }

    return result;
  }

  @Get()
  findAll(@Param('boardId', ParseUUIDPipe) boardId: string) {
    const result = this.tasksService.findAllByBoard(boardId);

    if (result === undefined) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get(':id')
  findOne(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = this.tasksService.findOneByBoardId({ id, boardId });

    if (result === undefined) {
      throw new NotFoundException();
    }

    return result;
  }

  @Put(':id')
  update(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['task'])) updateTaskDto: UpdateTaskDto,
  ) {
    const result = this.tasksService.update({ ...updateTaskDto, boardId, id });

    if (result === undefined) {
      throw new BadRequestException();
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('boardId', ParseUUIDPipe) boardId: string, @Param('id', ParseUUIDPipe) id: string) {
    const result = this.tasksService.remove({ id, boardId });

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
