import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { ParticipantsRepository } from './participants.repository';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let repo: {
    create: jest.Mock;
    findByEmail: jest.Mock;
    findByCpf: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        { provide: ParticipantsRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('updates a participant and sanitizes CPF and phone', async () => {
    const existingParticipant = {
      id: 1,
      name: 'Ana',
      email: 'ana@example.com',
      cpf: '123.456.789-09',
      phone: '(11) 99999-9999',
      institution: 'USP',
      role: 'participant',
    };

    repo.findOne.mockResolvedValue(existingParticipant);
    repo.findByEmail.mockResolvedValue(null);
    repo.findByCpf.mockResolvedValue(null);
    repo.update.mockResolvedValue({
      ...existingParticipant,
      name: 'Ana Paula',
      cpf: '123.456.789-00',
      phone: '(11) 98888-7777',
      institution: 'UNICAMP',
      role: 'admin',
    });

    const result = await service.update(1, {
      name: 'Ana Paula',
      cpf: '12345678900',
      phone: '11988887777',
      institution: 'UNICAMP',
      role: 'admin',
    });

    expect(repo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        name: 'Ana Paula',
        cpf: '123.456.789-00',
        phone: '(11) 98888-7777',
        institution: 'UNICAMP',
        role: 'admin',
      }),
    );
    expect(result.name).toBe('Ana Paula');
  });
});
