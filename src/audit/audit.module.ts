import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditService } from '../audit/audit.service';
import { AuditController } from './audit.controller';
import { AuditTrail, AuditTrailSchema } from '../audit/audit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuditTrail.name, schema: AuditTrailSchema }]),
  ],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditTrailModule {}
