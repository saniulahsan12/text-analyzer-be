import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/user/entity/user.entity';

@Entity('snippets')
export class Snippet extends BaseEntity {
  @Column({ type: 'longtext', nullable: true })
  snippet: string;

  @ManyToOne(() => User, (user) => user.snippets)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
