import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Vote } from './vote.entity';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: 0 })
  voteCount: number;

  @OneToMany(() => Vote, (vote) => vote.quote)
  votes: Vote[];
}
