import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentVideoProgress } from './enrollment-video-progress.entity';
import { ParticipantsRepository } from '../participants/participants.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { CourseVideo } from '../courses/course-video.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { MarkVideoCompletedDto } from './dto/mark-video-completed.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(EnrollmentVideoProgress)
    private readonly progressRepo: Repository<EnrollmentVideoProgress>,
    @InjectRepository(CourseVideo)
    private readonly courseVideoRepo: Repository<CourseVideo>,
    private readonly participantsRepo: ParticipantsRepository,
    private readonly coursesRepo: CoursesRepository,
  ) {}

  /**
   * Toggle enrollment: if already enrolled, unenroll; otherwise, enroll.
   * Mirrors the frontend toggle behavior.
   */
  async toggle(
    dto: CreateEnrollmentDto,
  ): Promise<{ enrolled: boolean; enrollment?: Enrollment }> {
    const participant = await this.participantsRepo.findByEmail(
      dto.email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException(
        'Participante não encontrado. Inscreva-se no evento primeiro.',
      );
    }

    const course = await this.coursesRepo.findOne(dto.courseId);
    if (!course) {
      throw new NotFoundException('Minicurso não encontrado.');
    }

    // Check if already enrolled
    const existing = await this.enrollmentRepo.findOne({
      where: {
        participantId: participant.id,
        courseId: dto.courseId,
      },
    });

    if (existing) {
      // Unenroll
      await this.enrollmentRepo.remove(existing);
      return { enrolled: false };
    }

    // Enroll
    const enrollment = this.enrollmentRepo.create({
      participantId: participant.id,
      courseId: dto.courseId,
    });
    const saved = await this.enrollmentRepo.save(enrollment);
    return { enrolled: true, enrollment: saved };
  }

  async markVideoAsCompleted(dto: MarkVideoCompletedDto): Promise<{
    videoCompleted: boolean;
    enrollmentCompleted: boolean;
    completedAt?: Date;
  }> {
    const participant = await this.participantsRepo.findByEmail(
      dto.email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException('Participante não encontrado.');
    }

    const course = await this.coursesRepo.findOne(dto.courseId);
    if (!course) {
      throw new NotFoundException('Minicurso não encontrado.');
    }

    const enrollment = await this.enrollmentRepo.findOne({
      where: { participantId: participant.id, courseId: dto.courseId },
    });
    if (!enrollment) {
      throw new NotFoundException('Inscrição não encontrada para este minicurso.');
    }

    const video = await this.courseVideoRepo.findOne({
      where: { id: dto.videoId, courseId: dto.courseId },
    });
    if (!video) {
      throw new NotFoundException('Vídeo não encontrado para este minicurso.');
    }

    let progress = await this.progressRepo.findOne({
      where: { enrollmentId: enrollment.id, videoId: video.id },
    });

    if (!progress) {
      progress = this.progressRepo.create({
        enrollmentId: enrollment.id,
        videoId: video.id,
        isCompleted: true,
      });
      await this.progressRepo.save(progress);
    } else if (!progress.isCompleted) {
      progress.isCompleted = true;
      await this.progressRepo.save(progress);
    }

    const videos = await this.courseVideoRepo.find({ where: { courseId: course.id } });
    const completedVideos = await this.progressRepo.find({
      where: { enrollmentId: enrollment.id, isCompleted: true },
    });

    const isCourseCompleted =
      videos.length > 0 &&
      videos.every((courseVideo) =>
        completedVideos.some((entry) => entry.videoId === courseVideo.id),
      );

    if (isCourseCompleted && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
      await this.enrollmentRepo.save(enrollment);
      return {
        videoCompleted: true,
        enrollmentCompleted: true,
        completedAt: enrollment.completedAt,
      };
    }

    return {
      videoCompleted: true,
      enrollmentCompleted: false,
    };
  }

  /**
   * Get all enrollments for a participant by email.
   */
  async findByEmail(
    email: string,
  ): Promise<{ participantId: number; courseId: number; enrolledAt: Date }[]> {
    const participant = await this.participantsRepo.findByEmail(
      email.toLowerCase(),
    );
    if (!participant) {
      throw new NotFoundException('Participante não encontrado.');
    }

    return this.enrollmentRepo.find({
      where: { participantId: participant.id },
      relations: { course: true },
    });
  }

  /**
   * Get all participants enrolled in a specific course.
   */
  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { courseId },
      relations: { participant: true },
    });
  }
}
