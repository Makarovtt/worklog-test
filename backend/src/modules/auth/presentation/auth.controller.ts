import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@/shared/http/decorators/public.decorator';

import { AuthenticateUserUseCase } from '../application/authenticate-user.use-case';
import { GetCurrentUserUseCase } from '../application/get-current-user.use-case';
import { RegisterUserUseCase } from '../application/register-user.use-case';

import { CurrentUser } from './decorators/current-user.decorator';
import { AuthResponseDto, PublicUserDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthenticatedUser } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authenticate: AuthenticateUserUseCase,
    private readonly register: RegisterUserUseCase,
    private readonly getCurrentUser: GetCurrentUserUseCase,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Аутентификация по логину и паролю' })
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authenticate.execute(dto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя (роль FOREMAN)' })
  @ApiOkResponse({ type: AuthResponseDto })
  registerUser(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.register.execute(dto);
  }

  @Get('me')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Текущий пользователь' })
  @ApiOkResponse({ type: PublicUserDto })
  me(@CurrentUser() user: AuthenticatedUser): Promise<PublicUserDto> {
    return this.getCurrentUser.execute(user.id);
  }
}
