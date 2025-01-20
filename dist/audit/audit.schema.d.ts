import { Document, Types } from 'mongoose';
export declare class AuditTrail extends Document {
    action: string;
    module: string;
    documentId: string;
    user: Types.ObjectId;
    changes?: Record<string, any>;
    ipAddress?: string;
    timestamp?: Date;
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
