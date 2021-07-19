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
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new JoiValidationPipe(schemas['user'])) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.usersService.findOne(id);

    if (result === undefined) {
      throw new NotFoundException();
    }

    return result;
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(schemas['user'])) updateUserDto: UpdateUserDto,
  ) {
    const result = this.usersService.update(id, updateUserDto);

    if (result === undefined) {
      throw new BadRequestException();
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.usersService.remove(id);

    if (result === undefined) {
      throw new BadRequestException();
    }
  }
}
