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
} from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(schemas['board'])) createBoardDto: CreateBoardDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.boardsService.create(createBoardDto);
    res.status(HttpStatus.CREATED).send(result);
  }

  @Get()
  async findAll(@Res() res: Response | FastifyReply) {
    const result = await this.boardsService.findAll();
    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response | FastifyReply) {
    const result = await this.boardsService.findOne(id);

    if (result === undefined) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Put(':id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.boardsService.remove(id);

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
