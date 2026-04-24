import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../../password/password.service';
import { PrismaService } from '../../prisma.service';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;

  let usersRepository: {
    findById: jest.Mock;
    findByEmail: jest.Mock;
    update: jest.Mock;
  };

  let passwordService: {
    hashPassword: jest.Mock;
  };

  beforeEach(async () => {
    usersRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    passwordService = {
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: PasswordService, useValue: passwordService },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should update profile successfully', async () => {
    const userId = 1;
    const updateDto = {
      fullName: 'Rahmat Bagus Updated',
      email: 'rahmatupdated@example.com',
    };

    const existingUser = {
      id: 1,
      fullName: 'Rahmat Bagus',
      email: 'rahmat@example.com',
      password: 'hashed-password',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = {
      ...existingUser,
      fullName: updateDto.fullName,
      email: updateDto.email,
    };

    usersRepository.findById.mockResolvedValue(existingUser);
    usersRepository.findByEmail.mockResolvedValue(null);
    usersRepository.update.mockResolvedValue(updatedUser);

    const result = await service.update(userId, updateDto);

    expect(usersRepository.update).toHaveBeenCalled();
    expect(result.email).toBe(updateDto.email);
    expect(result.fullName).toBe(updateDto.fullName);
  });

  it('should throw ConflictException when email is already used by another user', async () => {
    const userId = 1;
    const updateDto = {
      email: 'used@example.com',
    };

    const existingUser = {
      id: 1,
      fullName: 'Rahmat Bagus',
      email: 'rahmat@example.com',
      password: 'hashed-password',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const anotherUser = {
      id: 2,
      fullName: 'Other User',
      email: 'used@example.com',
      password: 'hashed-password',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersRepository.findById.mockResolvedValue(existingUser);
    usersRepository.findByEmail.mockResolvedValue(anotherUser);

    await expect(service.update(userId, updateDto)).rejects.toThrow(
      new ConflictException('Email already in use'),
    );

    expect(usersRepository.update).not.toHaveBeenCalled();
  });
});