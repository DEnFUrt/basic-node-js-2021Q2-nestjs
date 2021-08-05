import {
  Controller,
  Get,
  Put,
  Res,
  Body,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';
import { BoardBody, BoardResponse } from 'src/common/types-swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('boards')
@ApiResponse({ status: 401, description: 'Access token is missing or invalid' })
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new board' })
  @ApiResponse({ status: 201, description: 'Creates a new board', type: BoardResponse })
  @ApiBody({ description: 'The create record', type: BoardBody })
  async create(
    @Body(new JoiValidationPipe(schemas['board'])) createBoardDto: CreateBoardDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.boardsService.create(createBoardDto);
    res.status(HttpStatus.CREATED).send(result);
  }

  @Get()
  @ApiOperation({ summary: 'Gets all boards' })
  @ApiResponse({ status: 200, description: 'Returns all boards', type: BoardResponse })
  @ApiResponse({ status: 404, description: 'Boards not found' })
  async findAll(@Res() res: Response | FastifyReply) {
    const result = await this.boardsService.findAll();
    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets the Board by ID (e.g. “/boards/123”)' })
  @ApiResponse({ status: 200, description: 'The board record', type: BoardResponse })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response | FastifyReply) {
    const result = await this.boardsService.findOne(id);

    if (result === undefined) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a Board by ID' })
  @ApiResponse({ status: 200, description: 'The board has been updated.', type: BoardResponse })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ description: 'The updated record', type: BoardBody })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['board'])) updateBoardDto: UpdateBoardDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.boardsService.update(id, updateBoardDto);

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Deletes a Board by ID. When somebody DELETE Board, all its Tasks should be deleted as well',
  })
  @ApiResponse({ status: 204, description: 'The board has been deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.boardsService.remove(id);

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
