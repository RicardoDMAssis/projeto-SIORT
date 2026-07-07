import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './participant.entity';

@Injectable()
export class ParticipantsRepository {
  constructor(
    @InjectRepository(Participant)
    private readonly repo: Repository<Participant>,
  ) {}

  async create(data: Partial<Participant>): Promise<Participant> {
    const participant = this.repo.create(data);
    return this.repo.save(participant);
  }

  async findByEmail(email: string): Promise<Participant | null> {
    return this.repo.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByCpf(cpf: string): Promise<Participant | null> {
    return this.repo.findOne({
      where: { cpf },
    });
  }

  async findAll(): Promise<Participant[]> {
    return this.repo.find({
      relations: { enrollments: { course: true } },
      order: { registeredAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Participant | null> {
    return this.repo.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}
