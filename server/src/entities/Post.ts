import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Field()
  @OneToMany(() => Argument, (argument) => argument.post)
  arguments: Argument[];

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
}
