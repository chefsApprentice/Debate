import { Request, Response } from "express";
import { Field, ObjectType } from "type-graphql";

export type MyContext = {
  req: Request;
  res: Response;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  error: string;
}
