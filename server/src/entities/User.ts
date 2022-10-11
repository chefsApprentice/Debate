import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

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

  //no field property, so graphql cannot select it
  @Column()
  password!: string;

  @Field(() => String)
  @CreateDateColumn()
  date_created: Date;

  @Field(() => String)
  @UpdateDateColumn()
  last_modified: Date;
}
