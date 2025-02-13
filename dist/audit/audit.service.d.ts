import { Model, Types } from 'mongoose';
import { AuditTrail, AuditTrailDocument, AuditAction } from './audit.schema';
import { UserDocument } from '../user/user.schema';
export declare class AuditService {
    private auditTrailModel;
    constructor(auditTrailModel: Model<AuditTrailDocument>);
    logAudit(action: AuditAction, module: string, documentId?: string, user?: UserDocument | Types.ObjectId, changes?: Record<string, any>, ipAddress?: string, userAgent?: string, metadata?: Record<string, any>): Promise<void>;
    getAuditLogs({ action, module, userId, startDate, endDate, page, limit, }: {
        action?: AuditAction;
        module?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        total: number;
        page: number;
        limit: number;
        pages: number;
        logs: (import("mongoose").Document<unknown, {}, AuditTrailDocument> & AuditTrail & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
}
