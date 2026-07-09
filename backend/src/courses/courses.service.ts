import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseVideoDto } from './dto/create-course-video.dto';
import { UpdateCourseVideoDto } from './dto/update-course-video.dto';
import { Course } from './course.entity';
import { CourseVideo } from './course-video.entity';

@Injectable()
export class CoursesService implements OnModuleInit {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    private readonly coursesRepo: CoursesRepository,
    @InjectRepository(CourseVideo)
    private readonly courseVideoRepo: Repository<CourseVideo>,
  ) {}

  // ─── Seed initial data on first run ────────────────────────────────
  async onModuleInit(): Promise<void> {
    const count = await this.coursesRepo.count();
    if (count === 0) {
      this.logger.log('Seeding initial courses...');
      const firstCourse = await this.coursesRepo.create({
        title: 'Minicurso 1: Introdução aos Implantes',
        instructor: 'Dr. Roberto Costa (USP)',
        description:
          'Introdução aos fundamentos da bioengenharia ortopédica, abordando anatomia articular, cinemática das articulações e critérios clínicos para indicação de implantes.',
        duration: '4 horas',
        schedule: '15/08 às 14:00',
        tags: JSON.stringify(['Bioengenharia', 'Clínica']),
      });
      const secondCourse = await this.coursesRepo.create({
        title: 'Minicurso 2: Materiais Biocompatíveis',
        instructor: 'Dra. Eliana Silva (UNICAMP)',
        description:
          'Estudo aprofundado dos materiais usados em implantes (ligas de titânio, cerâmicas avançadas e polímeros ultra-resistentes) e sua interação celular e óssea (osseointegração).',
        duration: '4 horas',
        schedule: '16/08 às 14:00',
        tags: JSON.stringify(['Metalurgia', 'Biocompatibilidade']),
      });

      await this.courseVideoRepo.save(
        this.courseVideoRepo.create([
          {
            courseId: firstCourse.id,
            title: 'Aula 1 - Fundamentos do tema',
            description: 'Visão geral e conceitos iniciais.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            order: 1,
          },
          {
            courseId: firstCourse.id,
            title: 'Aula 2 - Aplicações clínicas',
            description: 'Casos práticos e critérios clínicos.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            order: 2,
          },
          {
            courseId: secondCourse.id,
            title: 'Aula 1 - Materiais e propriedades',
            description: 'Introdução aos materiais utilizados.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            order: 1,
          },
          {
            courseId: secondCourse.id,
            title: 'Aula 2 - Biocompatibilidade e segurança',
            description: 'Como os materiais interagem com o organismo.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            order: 2,
          },
        ]),
      );
      this.logger.log('✅ 2 courses seeded successfully.');
    }
  }

  // ─── CRUD ──────────────────────────────────────────────────────────
  async create(dto: CreateCourseDto): Promise<Course> {
    return this.coursesRepo.create({
      ...dto,
      tags: dto.tags ? JSON.stringify(dto.tags) : '[]',
    });
  }

  async findAll(): Promise<(Course & { parsedTags: string[] })[]> {
    const courses = await this.coursesRepo.findAll();
    return courses.map((c) => ({
      ...c,
      parsedTags: JSON.parse(c.tags || '[]') as string[],
    }));
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepo.findOne(id);
    if (!course) {
      throw new NotFoundException('Minicurso não encontrado.');
    }
    return course;
  }

  async createVideo(courseId: number, dto: CreateCourseVideoDto): Promise<CourseVideo> {
    await this.findOne(courseId);

    const video = this.courseVideoRepo.create({
      courseId,
      ...dto,
    });

    return this.courseVideoRepo.save(video);
  }

  async findVideos(courseId: number): Promise<CourseVideo[]> {
    await this.findOne(courseId);

    return this.courseVideoRepo.find({
      where: { courseId },
      order: { order: 'ASC', id: 'ASC' },
    });
  }

  async updateVideo(
    courseId: number,
    videoId: number,
    dto: UpdateCourseVideoDto,
  ): Promise<CourseVideo> {
    await this.findOne(courseId);

    const video = await this.courseVideoRepo.findOne({ where: { id: videoId, courseId } });
    if (!video) {
      throw new NotFoundException('Vídeo não encontrado para este minicurso.');
    }

    Object.assign(video, dto);
    return this.courseVideoRepo.save(video);
  }

  async removeVideo(courseId: number, videoId: number): Promise<void> {
    await this.findOne(courseId);

    const video = await this.courseVideoRepo.findOne({ where: { id: videoId, courseId } });
    if (!video) {
      throw new NotFoundException('Vídeo não encontrado para este minicurso.');
    }

    await this.courseVideoRepo.remove(video);
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    // Verify existence
    await this.findOne(id);

    const updateData: Partial<Course> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.instructor !== undefined) updateData.instructor = dto.instructor;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.schedule !== undefined) updateData.schedule = dto.schedule;
    if (dto.tags !== undefined) updateData.tags = JSON.stringify(dto.tags);

    const updated = await this.coursesRepo.update(id, updateData);
    if (!updated) {
      throw new NotFoundException('Minicurso não encontrado.');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.coursesRepo.remove(id);
    if (!deleted) {
      throw new NotFoundException('Minicurso não encontrado.');
    }
  }
}
