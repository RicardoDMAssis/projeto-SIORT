import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Participant } from '../participants/participant.entity';
import { Course } from '../courses/course.entity';
import { EnrollmentVideoProgress } from './enrollment-video-progress.entity';

@Entity('enrollments')
@Unique(['participantId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  participantId: number;

  @Column()
  courseId: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  enrolledAt: Date;

  @ManyToOne(() => Participant, (participant) => participant.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => EnrollmentVideoProgress, (progress) => progress.enrollment)
  videoProgress: EnrollmentVideoProgress[];
}
