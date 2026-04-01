import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepo.findByUsername(username);
  }

  create(data: { username: string; hashedPassword: string }): Promise<User> {
    return this.usersRepo.create(data);
  }
}
