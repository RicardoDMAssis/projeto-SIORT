import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('enrollments')
@ApiTags('enrollments')
@UseGuards(ApiKeyGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /** POST /enrollments — Toggle enrollment (enroll/unenroll) */
  @Post()
  @ApiOperation({ summary: 'Inscrever ou remover inscrição em um minicurso' })
  @ApiBody({ type: CreateEnrollmentDto })
  toggle(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.toggle(dto);
  }

  /** GET /enrollments?email=xxx — List enrollments by participant email */
  @Get()
  findByEmail(@Query('email') email: string) {
    return this.enrollmentsService.findByEmail(email);
  }

  /** GET /enrollments/course/:courseId — List enrollments by course */
  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.findByCourse(courseId);
  }
}
