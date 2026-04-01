import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
