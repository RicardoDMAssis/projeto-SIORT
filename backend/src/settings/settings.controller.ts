import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('settings')
@ApiTags('settings')
@UseGuards(ApiKeyGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Obter todas as configurações' })
  getAll() {
    return this.settingsService.getAllSettings();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Obter configuração específica' })
  getByKey(@Param('key') key: string) {
    return this.settingsService.getSetting(key);
  }

  @Post()
  @ApiOperation({ summary: 'Atualizar ou criar configuração' })
  setSetting(@Body() body: { key: string; value: string }) {
    return this.settingsService.setSetting(body.key, body.value);
  }
}
