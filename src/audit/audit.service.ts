
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditTrail, AuditTrailDocument, AuditAction } from './audit.schema';
// import { AuditGateway } from './audit.gateway';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditTrail.name) private auditTrailModel: Model<AuditTrailDocument>,
    // private readonly auditGateway: AuditGateway, // WebSocket Gateway for real-time logs
  ) {}

  /**
   * Logs an audit event and includes user details in the log
   */
  // async logAudit(
  //   action: AuditAction,
  //   module: string,
  //   documentId?: string,
  //   user?: UserDocument | Types.ObjectId,
  //   changes?: Record<string, any>,
  //   ipAddress?: string,
  //   userAgent?: string
  // ): Promise<void> {
  //   const userId = user instanceof Types.ObjectId ? user : user?._id;

  //   const auditLog = new this.auditTrailModel({
  //     action,
  //     module,
  //     documentId,
  //     user: userId, // Store user reference
  //     metadata: changes,
  //     ipAddress,
  //     userAgent,
  //   });

  //   const savedLog = await auditLog.save();

  //   // Emit real-time WebSocket event
  //   // this.auditGateway.emitAuditLog(savedLog);
  // }

  async logAudit(
    action: AuditAction,
    module: string,
    documentId?: string,
    user?: UserDocument | Types.ObjectId,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any> // ✅ Add `metadata` as the last optional parameter
  ): Promise<void> {
    const userId = user instanceof Types.ObjectId ? user : user?._id;
  
    const auditLog = new this.auditTrailModel({
      action,
      module,
      documentId,
      user: userId, // Store user reference
      changes, // ✅ Ensure `changes` is correctly mapped
      metadata, // ✅ Ensure `metadata` is correctly mapped
      ipAddress,
      userAgent,
    });
  
    await auditLog.save();
  }
  

  /**
   * Fetch audit logs with full user details
   */
  async getAuditLogs({
    action,
    module,
    userId,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  }: {
    action?: AuditAction;
    module?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const filter: any = {};

    if (action) filter.action = action;
    if (module) filter.module = module;
    if (userId) filter.user = new Types.ObjectId(userId);
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await this.auditTrailModel
      .find(filter)
      .populate('user', 'name email role') // Fetch full user details
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.auditTrailModel.countDocuments(filter);
    
    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      logs,
    };
  }
}
