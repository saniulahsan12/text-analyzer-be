import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { SnippetModule } from './modules/snippet/snippet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        keepConnectionAlive: false,
        entities: [],
        autoLoadEntities: true,
        synchronize: Boolean(configService.get('DATABASE_SYNC')),
        extra: {
          decimalNumbers: true,
        },
        bigNumberStrings: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    SnippetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
