"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialSchema = exports.Material = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const create_materials_dto_1 = require("../materials/dto/create-materials.dto");
let Material = class Material {
};
exports.Material = Material;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Material.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "fileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: create_materials_dto_1.MaterialStatus, default: create_materials_dto_1.MaterialStatus.PENDING }),
    __metadata("design:type", String)
], Material.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Material.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: create_materials_dto_1.AcademicLevel, required: true }),
    __metadata("design:type", String)
], Material.prototype, "academicLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: create_materials_dto_1.Semester, required: true }),
    __metadata("design:type", String)
], Material.prototype, "semester", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: create_materials_dto_1.MaterialType, required: true }),
    __metadata("design:type", String)
], Material.prototype, "materialType", void 0);
exports.Material = Material = __decorate([
    (0, mongoose_1.Schema)()
], Material);
exports.MaterialSchema = mongoose_1.SchemaFactory.createForClass(Material);
//# sourceMappingURL=materials.schema.js.map