import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already taken');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      username: dto.username,
      hashedPassword,
    });

    return this.issueTokens(user.id, user.username);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.username);
  }

  async refresh(token: string) {
    const stored = await this.refreshTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return {
      accessToken: this.signAccessToken(stored.user.id, stored.user.username),
    };
  }

  async logout(token: string) {
    await this.refreshTokenRepo.delete({ token });
  }

  private async issueTokens(userId: number, username: string) {
    const accessToken = this.signAccessToken(userId, username);

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({ token, expiresAt, user: { id: userId } }),
    );

    return { accessToken, refreshToken: token };
  }

  private signAccessToken(userId: number, username: string) {
    return this.jwtService.sign({ sub: userId, username });
  }
}
