import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { CourseVideo } from './course-video.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  instructor: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 50 })
  duration: string;

  @Column({ length: 100 })
  schedule: string;

  @Column({ type: 'text', default: '[]' })
  tags: string; // JSON-serialized string array

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => CourseVideo, (video) => video.course)
  videos: CourseVideo[];
}
