import { Role } from "@prisma/client";
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';

export function createRegisterDtoMock(
    overrides: Partial<RegisterDto> = {},
): RegisterDto {
    return {
        fullName: 'Customer Test',
        email: 'test@mail.com',
        password: 'test123',
        ...overrides,
    };
}

export function createLoginDtoMock(
    overrides: Partial<LoginDto> = {},
): LoginDto {
    return {
        email: 'test@mail.com',
        password: 'test123',
        ...overrides,
    };
}

export function createUserMock(
    overrides = {}
) {
    return {
        id: 1,
        fullName: 'Customer Test',
        email: 'test@mail.com',
        password: 'test123',
        role: Role.CUSTOMER,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

export function createSafeUserMock(
    overrides = {}
) {
    return {
        id: 1,
        fullName: 'Customer Test',
        email: 'test@mail.com',
        role: Role.CUSTOMER,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    }
}