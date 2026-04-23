import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { PasswordService } from '../../password/password.service';
import {
  createLoginDtoMock,
  createRegisterDtoMock,
  createSafeUserMock,
  createUserMock,
} from './mocks/auth.mock';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPasswordService = {
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerDto = createRegisterDtoMock();
      const safeUser = createSafeUserMock();

      mockUsersService.create.mockResolvedValue(safeUser);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        message: 'User registered successfully',
        data: safeUser,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      const registerDto = createRegisterDtoMock();

      mockUsersService.create.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const loginDto = createLoginDtoMock();
      const user = createUserMock();

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockPasswordService.comparePassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock-access-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        accessToken: 'mock-access-token',
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = createLoginDtoMock();

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto = createLoginDtoMock();
      const user = createUserMock();

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockPasswordService.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
    });
  });
});
