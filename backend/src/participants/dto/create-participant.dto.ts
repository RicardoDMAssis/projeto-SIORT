import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateParticipantDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do participante.' })
  @IsNotEmpty({ message: 'Nome completo é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do participante.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email: string;

  @ApiProperty({ example: '11999998888', description: 'Telefone com DDD.' })
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  phone: string;

  @ApiProperty({ example: '12345678909', description: 'CPF do participante.' })
  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  cpf: string;

  @ApiPropertyOptional({ example: 'USP', description: 'Instituição de origem do participante.' })
  @IsOptional()
  institution?: string;

  @ApiPropertyOptional({ example: 'participant', description: 'Função do participante no evento.' })
  @IsOptional()
  role?: string;
}
