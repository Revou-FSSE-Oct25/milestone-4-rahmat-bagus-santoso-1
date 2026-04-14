import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
//import { PasswordService } from '../password/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    // private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Prisma. UserCreateInput = {
      ...createUserDto,
      // password: await this.passwordService.hashPassword(createUserDto.password);
    }
    return this.usersRepository.create(data);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

   async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const data: Prisma.UserUpdateInput = {
      ...updateUserDto
    };

    // if (updateUserDto.password !== undefined) {
    //   data.password = await this.passwordService.hashPassword(
    //     updateUserDto.password,
    //   );
    // }
    return this.usersRepository.update(id, data);
  }

  remove(id: number): Promise<User> {
    return this.usersRepository.remove(id);
  }
}
