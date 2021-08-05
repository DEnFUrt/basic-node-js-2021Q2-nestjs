import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import type { FastifyReply } from 'fastify';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe } from 'src/utils/Joi-validation-pipe';
import { schemas } from 'src/utils/joi-schemas';
import { UserBody, UserResponse } from 'src/common/types-swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Users')
@ApiResponse({ status: 401, description: 'Access token is missing or invalid' })
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new user (remove password from response)' })
  @ApiResponse({ status: 201, description: 'The create record', type: UserResponse })
  @ApiBody({ description: 'The create record', type: UserBody })
  async create(
    @Body(new JoiValidationPipe(schemas['user'])) createUserDto: CreateUserDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.usersService.create(createUserDto);
    res.status(HttpStatus.CREATED).send(result);
  }

  @Get()
  @ApiOperation({ summary: 'Gets all users (remove password from response)' })
  @ApiResponse({ status: 200, description: 'The all users record', type: UserResponse })
  @ApiResponse({ status: 404, description: 'Users not found' })
  async findAll(@Res() res: Response | FastifyReply) {
    const result = await this.usersService.findAll();
    res.status(HttpStatus.OK).send(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets a user by ID e.g. “/users/123” (remove password from response)' })
  @ApiResponse({ status: 200, description: 'The user record', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response | FastifyReply) {
    const result = await this.usersService.findOne(id);

    if (result === undefined) {
      throw new NotFoundException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been updated.', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ description: 'The updated record', type: UserBody })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['userUpdated'])) updateUserDto: UpdateUserDto,
    @Res() res: Response | FastifyReply,
  ) {
    const result = await this.usersService.update(id, updateUserDto);

    if (result === undefined) {
      throw new BadRequestException();
    }

    res.status(HttpStatus.OK).send(result);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Deletes user by ID. When somebody DELETE User, all Tasks where User is assignee should be updated to put userId=null',
  })
  @ApiResponse({ status: 204, description: 'The user has been deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.usersService.remove(id);

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
