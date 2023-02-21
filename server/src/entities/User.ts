import { ObjectType, Field } from "type-graphql";
// import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field(() => [String])
  @Column("text", { array: true, nullable: true })
  topicsFollowed?: string[];

  //no field property, so graphql cannot select it
  @Column()
  password!: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @Field(() => [Number], { nullable: true })
  @Column("int", { array: true, nullable: true })
  likes?: number[];

  @Field(() => [Number], { nullable: true })
  @Column("int", { array: true, nullable: true })
  dislikes?: number[];

  @Field(() => [Number], { nullable: true })
  @Column("int", { array: true, nullable: true })
  argLikes?: number[];

  @Field(() => [Number], { nullable: true })
  @Column("int", { array: true, nullable: true })
  argDislikes?: number[];

  @Field(() => String)
  @CreateDateColumn()
  date_created: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_modified: Date;
}
