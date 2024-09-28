import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entity/user.entity';

@Entity('snippets')
export class Snippet extends BaseEntity {
  @Column({ type: 'longtext', nullable: true })
  snippet: string;

  @ManyToOne(() => User, (user) => user.snippets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_id: number;
}
