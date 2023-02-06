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

  @Field()
  @Column()
  token: string;

  //no field property, so graphql cannot select it
  @Column()
  password!: string;

  @Field()
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Field(() => String)
  @CreateDateColumn()
  date_created: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_modified: Date;
}
