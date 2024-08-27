import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GmailModule } from './gmail/gmail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
