import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginParticipantDto {
  @ApiProperty({ example: 'joao@email.com', description: 'E-mail cadastrado do participante.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;
}
