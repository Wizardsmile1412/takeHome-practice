import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  create(data: { username: string; hashedPassword: string }): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}
