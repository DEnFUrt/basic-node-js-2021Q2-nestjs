import {
  Controller,
  Get,
  Put,
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
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new JoiValidationPipe(schemas['board'])) createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.boardsService.findOne(id);

    if (result === undefined) {
      throw new NotFoundException();
    }

    return result;
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['board'])) updateBoardDto: UpdateBoardDto,
  ) {
    const result = this.boardsService.update(id, updateBoardDto);

    if (result === undefined) {
      throw new BadRequestException();
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.boardsService.remove(id);

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
