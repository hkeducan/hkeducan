import { IsNotEmpty, IsIn } from 'class-validator';
export class PresignDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  mimeType: string;

  @IsIn(['file','video'])
  kind: 'file' | 'video';
}
