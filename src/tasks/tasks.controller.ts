import {
  Controller,
  Get,
  Put,
  Res,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
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
  async create(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body(new JoiValidationPipe(schemas['task'])) createTaskDto: CreateTaskDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.tasksService.create({ ...createTaskDto, boardId });

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.CREATED).send(result);
  }

  @Get()
  async findAll(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.tasksService.findAllByBoard(boardId);

    if (result === undefined) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  async findOne(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.tasksService.findOneByBoardId({ id, boardId });

    if (result === undefined) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Put(':id')
  async update(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['task'])) updateTaskDto: UpdateTaskDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.tasksService.update({ ...updateTaskDto, boardId, id });

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Delete(':id')
  async remove(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.tasksService.remove({ id, boardId });

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.NO_CONTENT);
  }
}
