import { Model } from 'mongoose';
import { AuditTrail } from './audit.schema';
export declare class AuditService {
    private auditTrailModel;
    constructor(auditTrailModel: Model<AuditTrail>);
    logAudit(action: string, module: string, documentId: string, userId?: string, changes?: Record<string, any>, ipAddress?: string): Promise<void>;
}
