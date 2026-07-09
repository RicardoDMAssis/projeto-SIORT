import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCourseVideoDto {
  @ApiPropertyOptional({ example: 'Introdução ao tema', description: 'Novo título do vídeo.' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Resumo do vídeo.', description: 'Nova descrição do vídeo.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://video.example.com/intro', description: 'Nova URL do vídeo.' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 2, description: 'Nova ordem do vídeo dentro do curso.' })
  @IsOptional()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Indica se o vídeo passa a ser uma prévia.' })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;
}
