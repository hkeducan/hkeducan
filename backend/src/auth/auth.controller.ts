import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string; role?: string }) {
    const exists = await this.usersService.findByEmail(body.email);
    if (exists) throw new BadRequestException('Email already registered');
    const user = await this.authService.register(body.email, body.password, body.name, body.role || 'STUDENT');
    return { id: user.id, email: user.email, status: user.status };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    return token;
  }
}