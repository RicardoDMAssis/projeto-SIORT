import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { CourseVideo } from '../courses/course-video.entity';

@Entity('enrollment_video_progress')
@Unique(['enrollmentId', 'videoId'])
export class EnrollmentVideoProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enrollmentId: number;

  @Column()
  videoId: number;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  watchedAt: Date;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.videoProgress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollmentId' })
  enrollment: Enrollment;

  @ManyToOne(() => CourseVideo, (video) => video.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'videoId' })
  video: CourseVideo;
}
