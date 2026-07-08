import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ParticipantsRepository } from './participants.repository';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(private readonly participantsRepo: ParticipantsRepository) {}

  async create(dto: CreateParticipantDto): Promise<Participant> {
    // Sanitize and format CPF
    const cleanCpf = dto.cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      throw new ConflictException('CPF inválido. O CPF deve conter exatamente 11 dígitos.');
    }
    const formattedCpf = cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    // Sanitize and format Phone
    const cleanPhone = dto.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      throw new ConflictException('Telefone inválido. O telefone deve conter 10 ou 11 dígitos.');
    }
    const formattedPhone = cleanPhone.length === 11
      ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      : cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');

    // Check for duplicate email
    const existing = await this.participantsRepo.findByEmail(
      dto.email.toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(
        'Já existe um participante cadastrado com este e-mail.',
      );
    }

    // Check for duplicate CPF
    const existingCpf = await this.participantsRepo.findByCpf(formattedCpf);
    if (existingCpf) {
      throw new ConflictException(
        'Já existe um participante cadastrado com este CPF.',
      );
    }

    return this.participantsRepo.create({
      ...dto,
      email: dto.email.toLowerCase(),
      cpf: formattedCpf,
      phone: formattedPhone,
    });
  }

  async findByEmail(email: string): Promise<Participant> {
    const participant = await this.participantsRepo.findByEmail(
      email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException(
        'E-mail não cadastrado no evento. Por favor, verifique a grafia ou inscreva-se.',
      );
    }
    return participant;
  }

  async findAll(): Promise<Participant[]> {
    return this.participantsRepo.findAll();
  }

  async findOne(id: number): Promise<Participant> {
    const participant = await this.participantsRepo.findOne(id);
    if (!participant) {
      throw new NotFoundException('Participante não encontrado.');
    }
    return participant;
  }

  async update(id: number, dto: Partial<CreateParticipantDto> & { role?: string; institution?: string }): Promise<Participant> {
    const participant = await this.findOne(id);

    const normalizedData: Partial<Participant> = { ...dto };

    if (dto.name !== undefined) {
      normalizedData.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      normalizedData.email = dto.email.toLowerCase();
    }

    if (dto.cpf !== undefined) {
      const cleanCpf = dto.cpf.replace(/\D/g, '');
      if (cleanCpf.length !== 11) {
        throw new ConflictException('CPF inválido. O CPF deve conter exatamente 11 dígitos.');
      }
      normalizedData.cpf = cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (dto.phone !== undefined) {
      const cleanPhone = dto.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
        throw new ConflictException('Telefone inválido. O telefone deve conter 10 ou 11 dígitos.');
      }
      normalizedData.phone = cleanPhone.length === 11
        ? cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        : cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    if (dto.email !== undefined) {
      const existing = await this.participantsRepo.findByEmail(normalizedData.email as string);
      if (existing && existing.id !== participant.id) {
        throw new ConflictException('Já existe um participante cadastrado com este e-mail.');
      }
    }

    if (dto.cpf !== undefined) {
      const existingCpf = await this.participantsRepo.findByCpf(normalizedData.cpf as string);
      if (existingCpf && existingCpf.id !== participant.id) {
        throw new ConflictException('Já existe um participante cadastrado com este CPF.');
      }
    }

    const updated = await this.participantsRepo.update(id, normalizedData);
    if (!updated) {
      throw new NotFoundException('Participante não encontrado.');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const removed = await this.participantsRepo.remove(id);
    if (!removed) {
      throw new NotFoundException('Participante não encontrado.');
    }
  }

  async count(): Promise<number> {
    return this.participantsRepo.count();
  }
}
