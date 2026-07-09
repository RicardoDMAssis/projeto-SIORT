import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do participante cadastrado.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @ApiProperty({ example: 1, description: 'ID do minicurso para matrícula.' })
  @IsInt({ message: 'ID do curso deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'ID do curso é obrigatório.' })
  courseId: number;
}
