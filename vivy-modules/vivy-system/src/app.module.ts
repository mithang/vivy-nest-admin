import * as path from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule, TokenConstants } from '@vivy-common/core'
import { LoggerModule, TypeORMLogger } from '@vivy-common/logger'
import { MybatisModule } from '@vivy-common/mybatis'
import { SecurityModule } from '@vivy-common/security'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommonModule } from './common/common.module'
import { AuthModule } from './modules/auth/auth.module'
import { GenModule } from './modules/gen/gen.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { SystemModule } from './modules/system/system.module'

@Module({
  imports: [
    // plugin
    ConfigModule.forRoot({
      dir: path.join(__dirname, 'config'),
    }),
    MybatisModule.forRoot({
      dtsPath: path.join(__dirname, '../types/mapper.d.ts'),
      patterns: path.join(__dirname, '**/*.mapper.xml'),
    }),
    RedisModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          config: config.get<RedisModuleOptions['config']>('redis.defalut'),
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          ...config.get<TypeOrmModuleOptions>('datasource.defalut'),
          logger: new TypeORMLogger({
            appName: config.get('app.name'),
            logPath: path.join(__dirname, '../logs'),
          }),
        }
      },
      inject: [ConfigService],
    }),

    // common
    CoreModule.forRoot(),
    LoggerModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          appName: config.get('app.name'),
          logPath: path.join(__dirname, '../logs'),
        }
      },
      inject: [ConfigService],
    }),
    SecurityModule.forRootAsync({
      useFactory() {
        return {
          secret: TokenConstants.SECRET,
        }
      },
    }),
    CommonModule,

    // modules
    AuthModule,
    GenModule,
    SystemModule,
    MonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
