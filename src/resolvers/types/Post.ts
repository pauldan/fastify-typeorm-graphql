import { Field, InputType } from 'type-graphql';

@InputType()
export class PostCreateInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}
