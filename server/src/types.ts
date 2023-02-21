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

@ObjectType()
export class OperationFieldResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
<<<<<<< HEAD
  @Field(() => String, { nullable: true })
=======
  @Field()
>>>>>>> 59d6e8692c01d6801d0f639d2467ff0dd3ae420d
  operation?: string;
}
