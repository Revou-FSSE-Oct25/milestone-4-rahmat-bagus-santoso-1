import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req } from '@nestjs/common';
import { UsersService, SafeUser } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/authenticated.request';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';



@ApiTags('Users')
@ApiBearerAuth('authBearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get profile for current user'})
  @Get('profile')
  async getProfile(@Req() request: AuthenticatedRequest): Promise<SafeUser> {
    return this.usersService.findOne(request.user.userId)
  }

  @ApiOperation({ summary: 'Update profile for current user'})
  @Patch('profile')
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDTO,
  ): Promise<SafeUser> {
    return this.usersService.update(request.user.userId, updateProfileDto);
  }

  @ApiOperation({ summary: 'Create user by ADMIN'})
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<SafeUser> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get All Users By Admin'})
  @Roles(Role.ADMIN)
  @Get()
  findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get user detail by admin' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.usersService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<SafeUser> {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by admin' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    return this.usersService.remove(id);
  }
}
