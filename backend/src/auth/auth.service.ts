import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(email: string, password: string, name: string, role: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, name, passwordHash: hash, role });
    return user;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(pass, user.passwordHash);
    if (!valid) return null;
    if (user.status !== UserStatus.ENABLED) throw new UnauthorizedException('Account not enabled');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { username: user.email, sub: user.id, role: user.role, status: user.status };
    return { access_token: this.jwtService.sign(payload) };
  }
}