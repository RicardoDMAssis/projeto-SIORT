import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { ParticipantsRepository } from '../participants/participants.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { CourseVideo } from '../courses/course-video.entity';
import { EnrollmentVideoProgress } from './enrollment-video-progress.entity';

describe('EnrollmentsService video progress', () => {
  let service: EnrollmentsService;
  let enrollmentRepo: Partial<Record<keyof Repository<Enrollment>, jest.Mock>>;
  let progressRepo: Partial<Record<keyof Repository<EnrollmentVideoProgress>, jest.Mock>>;
  let videoRepo: Partial<Record<keyof Repository<CourseVideo>, jest.Mock>>;
  let participantsRepo: Partial<ParticipantsRepository>;
  let coursesRepo: Partial<CoursesRepository>;

  beforeEach(async () => {
    enrollmentRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };
    progressRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    videoRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
    };
    participantsRepo = {
      findByEmail: jest.fn(),
    };
    coursesRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: getRepositoryToken(Enrollment), useValue: enrollmentRepo },
        { provide: getRepositoryToken(EnrollmentVideoProgress), useValue: progressRepo },
        { provide: getRepositoryToken(CourseVideo), useValue: videoRepo },
        { provide: ParticipantsRepository, useValue: participantsRepo },
        { provide: CoursesRepository, useValue: coursesRepo },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('marks the enrollment as completed when the last video is watched', async () => {
    const participant = { id: 10, email: 'student@example.com' } as any;
    const enrollment = {
      id: 22,
      participantId: 10,
      courseId: 5,
      isCompleted: false,
    } as any;
    const course = { id: 5 } as any;
    const videos = [{ id: 1 }, { id: 2 }] as any[];

    (participantsRepo.findByEmail as jest.Mock).mockResolvedValue(participant);
    (enrollmentRepo.findOne as jest.Mock).mockResolvedValue(enrollment);
    (coursesRepo.findOne as jest.Mock).mockResolvedValue(course);
    (videoRepo.find as jest.Mock).mockResolvedValue(videos);
    (videoRepo.findOne as jest.Mock).mockResolvedValue(videos[1]);
    (progressRepo.findOne as jest.Mock).mockResolvedValue(null);
    (progressRepo.create as jest.Mock).mockImplementation((data) => data);
    (progressRepo.save as jest.Mock).mockImplementation((data) => data);
    (enrollmentRepo.save as jest.Mock).mockImplementation((data) => data);

    await service.markVideoAsCompleted({
      email: 'student@example.com',
      courseId: 5,
      videoId: 2,
    });

    expect(progressRepo.save).toHaveBeenCalled();
    expect(enrollmentRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ isCompleted: true, completedAt: expect.any(Date) }),
    );
  });
});
