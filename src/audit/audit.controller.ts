import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditAction } from './audit.schema';

@Controller('admin/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Get audit logs with optional filtering.
   * Supports filtering by action, module, user, and date range.
   */
  @Get()
  async getAuditLogs(
    @Query('action') action?: AuditAction,
    @Query('module') module?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.auditService.getAuditLogs({
      action,
      module,
      userId,
      startDate,
      endDate,
      page: Number(page),
      limit: Number(limit),
    });
  }
}
