import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Minicurso de Implantes', description: 'Título do minicurso.' })
  @IsNotEmpty({ message: 'Título é obrigatório.' })
  title: string;

  @ApiProperty({ example: 'Dr. João Pereira', description: 'Nome do instrutor.' })
  @IsNotEmpty({ message: 'Instrutor é obrigatório.' })
  instructor: string;

  @ApiProperty({ example: 'Descrição detalhada do minicurso.', description: 'Descrição do minicurso.' })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  description: string;

  @ApiProperty({ example: '4 horas', description: 'Duração do minicurso.' })
  @IsNotEmpty({ message: 'Duração é obrigatória.' })
  duration: string;

  @ApiProperty({ example: '15/08 às 14:00', description: 'Horário do minicurso.' })
  @IsNotEmpty({ message: 'Horário é obrigatório.' })
  schedule: string;

  @ApiPropertyOptional({ example: ['Implante', 'Ortopedia'], description: 'Lista de tags do minicurso.' })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array.' })
  tags?: string[];
}
