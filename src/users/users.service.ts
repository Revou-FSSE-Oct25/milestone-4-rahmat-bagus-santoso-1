import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { PasswordService } from '../password/password.service';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });


    return this.toSafeUser(user);
  }

  async findAll(): Promise<SafeUser[]> {
    return this.usersRepository.findAll();
  }

  
  async findOne(id: number): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // untuk login dan pengecekan email unik saat register
  findByEmail(email: string): Promise<User | null> { 
    return this.usersRepository.findByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
    };

   
    return this.usersRepository.update(id, data);
  }

  remove(id: number): Promise<User> {
    return this.usersRepository.remove(id);
  }

  toSafeUser(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    return  safeUser;
  }
}
