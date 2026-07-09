import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Minicurso de Implantes', description: 'Novo título do minicurso.' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Dr. João Pereira', description: 'Novo instrutor do minicurso.' })
  @IsOptional()
  instructor?: string;

  @ApiPropertyOptional({ example: 'Descrição atualizada.', description: 'Nova descrição do minicurso.' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '4 horas', description: 'Nova duração do minicurso.' })
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ example: '16/08 às 14:00', description: 'Novo horário do minicurso.' })
  @IsOptional()
  schedule?: string;

  @ApiPropertyOptional({ example: ['Implante'], description: 'Novas tags do minicurso.' })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array.' })
  tags?: string[];
}
