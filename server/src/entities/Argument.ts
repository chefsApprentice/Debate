import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "../resolvers/User";

@ObjectType()
@Entity()
export class Argument extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.arguments)
  post!: Post;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  points: string[];
}
