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
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { CryptoService } from 'src/utils-crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  private toResponse(user: UserDto): ResponseUserDto {
    const { id, name, login } = user;
    return { id, name, login };
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { password } = createUserDto;

    const hashedPassword = await this.cryptoService.hashByPassword(password /* , SOLT_ROUNDS */);
    const newUserDto = { ...createUserDto, password: hashedPassword };

    const user = this.userRepository.create(newUserDto);
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

  async findOneByLogin(login: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOne({ login });

    if (user === undefined) {
      throw new ForbiddenException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto | undefined> {
    const { password } = updateUserDto;
    // const SOLT_ROUNDS = this.configService.get('SOLT_ROUNDS');

    const hashedPassword =
      password !== undefined
        ? await this.cryptoService.hashByPassword(password /* , SOLT_ROUNDS */)
        : null;
    const newUpdateUserDto =
      hashedPassword === null
        ? { ...updateUserDto }
        : { ...updateUserDto, password: hashedPassword };

    const result = await this.userRepository.update(id, newUpdateUserDto);
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
