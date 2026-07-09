import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseVideoDto {
  @ApiProperty({ example: 'Introdução ao tema', description: 'Título do vídeo.' })
  @IsNotEmpty({ message: 'Título do vídeo é obrigatório.' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Resumo do conteúdo do vídeo.', description: 'Descrição do vídeo.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://video.example.com/intro', description: 'URL do vídeo.' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 1, description: 'Ordem do vídeo dentro do curso.' })
  @IsOptional()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({ example: false, description: 'Indica se o vídeo é uma prévia.' })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;
}
