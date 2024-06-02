import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Orders {
    @ObjectIdColumn()
    _id: string;
    
    @Column()
    username: string;
    
    @Column()
    password: string;
}