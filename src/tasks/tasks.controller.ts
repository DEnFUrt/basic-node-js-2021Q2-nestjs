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
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';
import { TaskBody, TaskResponse } from 'src/common/types-swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('tasks')
@ApiResponse({ status: 401, description: 'Access token is missing or invalid' })
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new task' })
  @ApiResponse({ status: 201, description: 'Creates a new task', type: TaskResponse })
  @ApiBody({ description: 'The create record', type: TaskBody })
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
  @ApiOperation({ summary: 'Gets task by board ID' })
  @ApiResponse({
    status: 200,
    description: 'Gets tasks by the Board ID (e.g. “/board/1/tasks”)',
    type: TaskResponse,
  })
  @ApiResponse({ status: 404, description: 'Tasks not found' })
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
  @ApiOperation({ summary: 'Gets task by board ID and task ID' })
  @ApiResponse({
    status: 200,
    description: 'Gets the Task by the Boards and task ID (e.g. “/board/1/tasks/123”)',
    type: TaskResponse,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
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
  @ApiOperation({ summary: 'Updates a Task by ID' })
  @ApiResponse({ status: 200, description: 'Updates the Task by ID', type: TaskResponse })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ description: 'The updated record', type: TaskBody })
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
  @ApiOperation({ summary: 'Deletes Task' })
  @ApiResponse({ status: 204, description: 'Deletes Task by ID.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this.tasksService.remove({ id, boardId });

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
