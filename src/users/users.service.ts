import { Injectable } from '@nestjs/common';
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

    const hashedPassword = await this.cryptoService.hashByPassword(password);
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

    if (user !== undefined) {
      return this.toResponse(user);
    }

    return undefined;
  }

  async findOneByLogin(login: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOne({ login });

    if (user !== undefined) {
      return user;
    }

    return undefined;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto | undefined> {
    const { password } = updateUserDto;

    const hashedPassword =
      password !== undefined ? await this.cryptoService.hashByPassword(password) : null;
    const newUpdateUserDto =
      hashedPassword === null
        ? { ...updateUserDto }
        : { ...updateUserDto, password: hashedPassword };

    // Вариант использования метода update
    const result = await this.userRepository.update(id, newUpdateUserDto);
    const { affected } = result;

    if (affected !== undefined && affected > 0) {
      return this.findOne(id);
    }

    return undefined;
  }

  async remove(id: string): Promise<boolean | undefined> {
    const result = await this.userRepository.delete(id);
    const { affected } = result;

    if (affected && affected > 0) {
      return true;
    }

    return undefined;
  }
}
