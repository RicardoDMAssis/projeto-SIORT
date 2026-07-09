import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { ParticipantsRepository } from '../participants/participants.repository';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly participantsRepo: ParticipantsRepository,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  /**
   * Consolidate certificate data for a participant:
   * - Participant info (for main event certificate)
   * - List of enrolled courses (for individual minicourse certificates)
   */
  async findByEmail(email: string): Promise<{
    participant: {
      id: number;
      name: string;
      email: string;
      phone: string;
      registeredAt: Date;
    };
    courses: {
      id: number;
      title: string;
      instructor: string;
      duration: string;
      enrolledAt: Date;
      isCompleted: boolean;
      completedAt?: Date;
    }[];
  }> {
    const participant = await this.participantsRepo.findByEmail(
      email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException(
        'E-mail não cadastrado no evento. Certifique-se de que digitou o e-mail correto ou realize sua inscrição.',
      );
    }

    const enrollments = await this.enrollmentRepo.find({
      where: { participantId: participant.id },
      relations: { course: true },
      order: { enrolledAt: 'ASC' },
    });

    return {
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        registeredAt: participant.registeredAt,
      },
      courses: enrollments.map((en) => ({
        id: en.course.id,
        title: en.course.title,
        instructor: en.course.instructor,
        duration: en.course.duration,
        enrolledAt: en.enrolledAt,
        isCompleted: en.isCompleted,
        completedAt: en.completedAt,
      })),
    };
  }
}
