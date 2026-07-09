import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentVideoProgress } from './enrollment-video-progress.entity';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { ParticipantsModule } from '../participants/participants.module';
import { CoursesModule } from '../courses/courses.module';
import { CourseVideo } from '../courses/course-video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, EnrollmentVideoProgress, CourseVideo]),
    ParticipantsModule,
    CoursesModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [TypeOrmModule],
})
export class EnrollmentsModule {}
