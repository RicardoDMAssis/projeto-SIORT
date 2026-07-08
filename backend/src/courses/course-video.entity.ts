import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Course } from './course.entity';
import { EnrollmentVideoProgress } from '../enrollments/enrollment-video-progress.entity';

@Entity('course_videos')
export class CourseVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  videoUrl: string;

  @Column({ default: 1 })
  order: number;

  @Column({ default: false })
  isPreview: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => EnrollmentVideoProgress, (progress) => progress.video)
  progress: EnrollmentVideoProgress[];
}
