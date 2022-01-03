import { v4 as uuidV4 } from 'uuid';
import { Expose } from 'class-transformer';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  driver_license: string;

  @Column()
  isAdmin: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @Expose({ name: 'avatar_url' })
  avatar_url(): string {
    switch(process.env.DISK_STORAGE)  {
      case 'local':
        return `${process.env.URL_LOCAL}/avatar/${this.avatar}`;
      case "s3":
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
      default:
        return null
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { User };
