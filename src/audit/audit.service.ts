import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditTrail } from './audit.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditTrail.name) private auditTrailModel: Model<AuditTrail>,
  ) {}

  async logAudit(
    action: string,
    module: string,
    documentId: string,
    userId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
  ): Promise<void> {
    const auditLog = new this.auditTrailModel({
      action,
      module,
      documentId,
      userId,
      changes,
      ipAddress,
      timestamp: new Date(),
    });
    await auditLog.save();
  }
}
