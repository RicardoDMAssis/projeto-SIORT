import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const isTest = process.env.NODE_ENV === 'test';
const databasePath = process.env.DB_PATH ?? './siort.sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databasePath,
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: isTest,
    }),
  ],
})
export class DatabaseModule {}
