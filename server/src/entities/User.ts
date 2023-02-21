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

<<<<<<< HEAD
=======
  @Field(() => [String])
  @Column("string", { array: true })
  topicsFollows: string[];

>>>>>>> 59d6e8692c01d6801d0f639d2467ff0dd3ae420d
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

<<<<<<< HEAD
  @Field(() => [Number], { nullable: true })
  @Column("int", { array: true, nullable: true })
  argLikes?: number[];

  @Field(() => [Number], { nullable: true })
=======
  @Field(() => [Number])
  @Column("int", { array: true, nullable: true })
  argLikes?: number[];

  @Field(() => [Number])
>>>>>>> 59d6e8692c01d6801d0f639d2467ff0dd3ae420d
  @Column("int", { array: true, nullable: true })
  argDislikes?: number[];

  @Field(() => String)
  @CreateDateColumn()
  date_created: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_modified: Date;
}
