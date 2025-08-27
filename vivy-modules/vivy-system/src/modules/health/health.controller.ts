import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus'
import { Public } from '@vivy-common/security'
import { HealthService } from './health.service'

/**
 * Health check
 * @author vivy
 */
@ApiTags('Health check')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService
  ) {}

  /**
   * Health check
   */
  @Get()
  @Public()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    try {
      return await this.health.check([
        () => this.healthService.checkNetwork(),
        () => this.healthService.checkMysql(),
        () => this.healthService.checkRedis(),
        () => this.healthService.checkDisk(),
        () => this.healthService.checkMemoryHeap(),
        () => this.healthService.checkMemoryRSS(),
      ])
    } catch (error) {
      // TODO: send email to the admin
      return (error as ServiceUnavailableException).getResponse() as HealthCheckResult
    }
  }
}
