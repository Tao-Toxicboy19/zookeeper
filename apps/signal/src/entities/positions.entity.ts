import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Positions {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    symbol: string

    @Column({ nullable: true })
    position: string

    @Column({ nullable: true })
    type: string

    @Column({ nullable: true })
    ema: number
}