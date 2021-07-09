import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private toResponse(user: User): ResponseUserDto {
    const { id, name, login } = user;
    return { id, name, login };
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    return this.toResponse(savedUser);
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    return users.map((user: User): ResponseUserDto => this.toResponse(user));
  }

  async findOne(id: string): Promise<ResponseUserDto | undefined> {
    const user = await this.userRepository.findOne(id);

    if (user === undefined) {
      throw new NotFoundException();
    }

    return this.toResponse(user);
  }

  async findOneByLogin(login: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ login });

    if (user === undefined) {
      throw new ForbiddenException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto | undefined> {
    const result = await this.userRepository.update(id, updateUserDto);
    const { affected } = result;

    if (affected !== undefined && affected > 0) {
      return this.findOne(id);
    }

    throw new BadRequestException();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
