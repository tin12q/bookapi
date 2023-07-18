import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsNumberString,
} from 'class-validator';

export class BookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly price: number;
}
