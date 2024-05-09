import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'Users', database: 'zookeeper' })
export class Users {
  @ObjectIdColumn()
  _id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ default: false })
  login: boolean

  @Column({ unique: true })
  email: string

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date
}