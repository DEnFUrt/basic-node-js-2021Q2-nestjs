import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardDto } from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<BoardDto> {
    const board = this.boardRepository.create(createBoardDto);
    return await this.boardRepository.save(board);
  }

  async findAll(): Promise<BoardDto[]> {
    return await this.boardRepository.find({ relations: ['columns'] });
  }

  async findOne(id: string): Promise<BoardDto | undefined> {
    return await this.boardRepository.findOne(id, { relations: ['columns'] });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<BoardDto | undefined> {
    await this.findOne(id);
    return await this.boardRepository.save(updateBoardDto);
  }

  async remove(id: string): Promise<boolean | undefined> {
    const result = await this.boardRepository.delete(id);
    const { affected } = result;

    if (affected && affected > 0) {
      return true;
    }

    return undefined;
  }
}
