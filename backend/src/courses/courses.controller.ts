import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseVideoDto } from './dto/create-course-video.dto';
import { UpdateCourseVideoDto } from './dto/update-course-video.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('courses')
@ApiTags('courses')
@UseGuards(ApiKeyGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** POST /courses — Create a new course */
  @Post()
  @ApiOperation({ summary: 'Criar novo minicurso' })
  @ApiBody({ type: CreateCourseDto })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  /** GET /courses — List all courses */
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  /** GET /courses/:id — Get course by ID */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  /** POST /courses/:id/videos — Create a new video for a course */
  @Post(':id/videos')
  @ApiOperation({ summary: 'Adicionar vídeo a um minicurso' })
  @ApiBody({ type: CreateCourseVideoDto })
  createVideo(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() dto: CreateCourseVideoDto,
  ) {
    return this.coursesService.createVideo(courseId, dto);
  }

  /** GET /courses/:id/videos — List videos for a course */
  @Get(':id/videos')
  findVideos(@Param('id', ParseIntPipe) courseId: number) {
    return this.coursesService.findVideos(courseId);
  }

  /** PUT /courses/:id/videos/:videoId — Update a course video */
  @Put(':id/videos/:videoId')
  @ApiOperation({ summary: 'Atualizar vídeo de um minicurso' })
  @ApiBody({ type: UpdateCourseVideoDto })
  updateVideo(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
    @Body() dto: UpdateCourseVideoDto,
  ) {
    return this.coursesService.updateVideo(courseId, videoId, dto);
  }

  /** DELETE /courses/:id/videos/:videoId — Remove a course video */
  @Delete(':id/videos/:videoId')
  removeVideo(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ) {
    return this.coursesService.removeVideo(courseId, videoId);
  }

  /** PUT /courses/:id — Update a course */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar minicurso' })
  @ApiBody({ type: UpdateCourseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  /** DELETE /courses/:id — Delete a course */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
