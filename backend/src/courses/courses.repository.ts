import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
  ) {}

  async create(data: Partial<Course>): Promise<Course> {
    const course = this.repo.create(data);
    return this.repo.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.repo.find({
      relations: { enrollments: { participant: true }, videos: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Course | null> {
    return this.repo.findOne({
      where: { id },
      relations: { videos: true },
    });
  }

  async update(id: number, data: Partial<Course>): Promise<Course | null> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}
