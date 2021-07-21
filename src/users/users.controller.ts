import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  // HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'The create record', type: UserDto })
  @ApiBody({ description: 'The create record', type: UserDto })
  async create(
    @Body(new JoiValidationPipe(schemas['user'])) createUserDto: CreateUserDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.usersService.create(createUserDto);
    res.status(HttpStatus.CREATED).send(result);
  }

  @Get()
  async findAll(@Res() res: Response | FastifyReply) {
    const result = await this.usersService.findAll();
    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response | FastifyReply) {
    const result = await this.usersService.findOne(id);

    if (result === undefined) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['user'])) updateUserDto: UpdateUserDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.usersService.update(id, updateUserDto);

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response | FastifyReply) {
    const result = await this.usersService.remove(id);

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.NO_CONTENT);
  }
}
