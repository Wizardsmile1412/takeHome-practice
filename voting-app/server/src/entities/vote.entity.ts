import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm'
import { User } from './user.entity'
import { Quote } from './quote.entity'

@Unique(['user', 'quote'])
@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=> User, (user) => user.votes)
    user: User

    @ManyToOne(()=> Quote, (quote) => quote.votes)
    quote: Quote
}