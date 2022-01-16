import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LocalSignUpDTO {
  @Length(3, 20)
  @IsNotEmpty({ message: 'username is required' })
  @IsString()
  username: string;

  @Length(3, 20)
  @IsNotEmpty({ message: 'firstName is required' })
  @IsString()
  firstName: string;

  @Length(3, 20)
  @IsNotEmpty({ message: 'last name is required' })
  @IsString()
  lastName: string;

  @IsEmail({ message: 'email is not valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @Length(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}

export class LocalSignInDTO {
  @IsEmail({ message: 'email is not valid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}

export class LocalAuthResposeDTO {
  user: {
    username: string;
    email: string;
  };
}

export class JWTAccessPayloadDTO {
  id: string;
}

export class JWTRefreshPayloadDTO {
  id: string;
  tokenVersion: number;
}

export class RefreshTokensResponseDTO {
  message: string;
  status: string;
}
