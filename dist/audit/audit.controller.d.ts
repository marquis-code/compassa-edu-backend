import { AuditService } from './audit.service';
import { AuditAction } from './audit.schema';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditLogs(action?: AuditAction, module?: string, userId?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        total: number;
        page: number;
        limit: number;
        pages: number;
        logs: (import("mongoose").Document<unknown, {}, import("./audit.schema").AuditTrailDocument> & import("./audit.schema").AuditTrail & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
}
