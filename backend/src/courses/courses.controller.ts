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
