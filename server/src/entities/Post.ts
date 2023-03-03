import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Argument } from "./Argument";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  @Field(() => [Argument], { nullable: true })
  @OneToMany(() => Argument, (argument) => argument.post, { nullable: true })
  arguments?: Argument[];

  @Field()
  @Column()
  topic!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  ranking: number;

  @Field(() => String)
  @CreateDateColumn()
  date_created: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_modified: Date;
}
