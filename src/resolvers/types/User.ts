import { InputType, Field } from 'type-graphql';

@InputType()
export class UserInput {
  @Field(() => String)
  firstname!: string;

  @Field(() => String)
  lastname!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;

  @Field()
  isAdmin!: boolean;
}

@InputType()
export class UserRegisterInput {
  @Field(() => String)
  firstname!: string;

  @Field(() => String)
  lastname!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String)
  confirmPassword!: string;
}
