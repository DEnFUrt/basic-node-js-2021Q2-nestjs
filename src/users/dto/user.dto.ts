import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'string', description: 'generate uuid' })
  id!: string;

  @ApiProperty({ example: 'string', description: 'user name' })
  name!: string;

  @ApiProperty({ example: 'string', description: 'required and unique string' })
  login!: string;

  @ApiProperty({
    example: 'A3ds%df@AD',
    description: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!@#$%^&*])(?=.{8,})',
  })
  password!: string;
}
