import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateVideoDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  key: string; // s3 key of uploaded original

  @IsOptional()
  resourceId?: string;
}
