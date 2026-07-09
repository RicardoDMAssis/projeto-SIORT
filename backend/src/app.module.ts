import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ParticipantsModule } from './participants/participants.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SettingsModule } from './settings/settings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    ParticipantsModule,
    CoursesModule,
    EnrollmentsModule,
    CertificatesModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
