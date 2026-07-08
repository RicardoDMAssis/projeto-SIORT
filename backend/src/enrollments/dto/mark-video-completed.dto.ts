import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class MarkVideoCompletedDto {
  @ApiProperty({ example: 'student@example.com', description: 'E-mail do participante inscrito.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 1, description: 'ID do minicurso.' })
  @IsNumber({}, { message: 'ID do minicurso deve ser um número.' })
  courseId: number;

  @ApiProperty({ example: 3, description: 'ID do vídeo assistido por completo.' })
  @IsNumber({}, { message: 'ID do vídeo deve ser um número.' })
  videoId: number;
}
