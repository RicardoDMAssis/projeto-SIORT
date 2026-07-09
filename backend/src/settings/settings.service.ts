import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
  ) {}

  async onModuleInit(): Promise<void> {
    const videoSetting = await this.settingsRepo.findOne({ where: { key: 'about_video_url' } });
    if (!videoSetting) {
      this.logger.log('Seeding initial setting: about_video_url');
      await this.settingsRepo.save(
        this.settingsRepo.create({
          key: 'about_video_url',
          value: 'https://www.youtube.com/embed/d3F-iY1u_rY',
        }),
      );
    }
  }

  async getSetting(key: string): Promise<Setting> {
    const setting = await this.settingsRepo.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Configuração com chave ${key} não encontrada.`);
    }
    return setting;
  }

  async setSetting(key: string, value: string): Promise<Setting> {
    let setting = await this.settingsRepo.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
    } else {
      setting = this.settingsRepo.create({ key, value });
    }
    return this.settingsRepo.save(setting);
  }

  async getAllSettings(): Promise<Setting[]> {
    return this.settingsRepo.find();
  }
}
