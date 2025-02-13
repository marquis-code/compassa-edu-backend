import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
export type AuditTrailDocument = AuditTrail & Document;
export declare enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    ACCESS = "ACCESS"
}
export declare class AuditTrail extends Document {
    action: AuditAction;
    module: string;
    documentId?: string;
    user: Types.ObjectId | User;
    changes?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    requestDetails?: Record<string, any>;
}
export declare const AuditTrailSchema: import("mongoose").Schema<AuditTrail, import("mongoose").Model<AuditTrail, any, any, any, Document<unknown, any, AuditTrail> & AuditTrail & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AuditTrail, Document<unknown, {}, import("mongoose").FlatRecord<AuditTrail>> & import("mongoose").FlatRecord<AuditTrail> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
