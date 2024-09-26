import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Snippet } from 'src/modules/snippet/entity/snippet.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'longtext', nullable: true })
  refresh_token: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => Snippet, (snippet) => snippet.user)
  snippets: Snippet[];
}
