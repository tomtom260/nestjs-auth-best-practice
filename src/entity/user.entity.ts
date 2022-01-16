import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ select: false })
  password: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @CreateDateColumn({ select: false, update: false })
  createdAt: string;

  @Column({ array: true, type: 'text', select: false, default: [] })
  usedRefreshTokens: string[];

  @Column({ select: false, default: 1 })
  tokenVersion: number;
}
