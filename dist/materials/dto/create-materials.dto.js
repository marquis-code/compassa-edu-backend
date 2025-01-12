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
exports.CreateMaterialDto = exports.AcademicLevel = exports.MaterialType = exports.Semester = exports.MaterialStatus = void 0;
const class_validator_1 = require("class-validator");
var MaterialStatus;
(function (MaterialStatus) {
    MaterialStatus["PENDING"] = "pending";
    MaterialStatus["APPROVED"] = "approved";
    MaterialStatus["REJECTED"] = "rejected";
})(MaterialStatus || (exports.MaterialStatus = MaterialStatus = {}));
var Semester;
(function (Semester) {
    Semester["FIRST"] = "first";
    Semester["SECOND"] = "second";
})(Semester || (exports.Semester = Semester = {}));
var MaterialType;
(function (MaterialType) {
    MaterialType["LECTURE_NOTE"] = "lecture_note";
    MaterialType["TEXTBOOK"] = "textbook";
    MaterialType["RESEARCH_PAPER"] = "research_paper";
    MaterialType["ASSIGNMENT"] = "assignment";
    MaterialType["PROJECT_REPORT"] = "project_report";
    MaterialType["EXAM_PAST_QUESTION"] = "exam_past_question";
    MaterialType["LAB_MANUAL"] = "lab_manual";
    MaterialType["STUDY_GUIDE"] = "study_guide";
    MaterialType["PRESENTATION_SLIDES"] = "presentation_slides";
    MaterialType["ARTICLE"] = "article";
    MaterialType["CASE_STUDY"] = "case_study";
    MaterialType["THESIS"] = "thesis";
    MaterialType["DISSERTATION"] = "dissertation";
    MaterialType["TUTORIAL_VIDEO"] = "tutorial_video";
    MaterialType["REFERENCE_MATERIAL"] = "reference_material";
})(MaterialType || (exports.MaterialType = MaterialType = {}));
var AcademicLevel;
(function (AcademicLevel) {
    AcademicLevel["ONE_HUNDRED"] = "100";
    AcademicLevel["TWO_HUNDRED"] = "200";
    AcademicLevel["THREE_HUNDRED"] = "300";
    AcademicLevel["FOUR_HUNDRED"] = "400";
    AcademicLevel["FIVE_HUNDRED"] = "500";
    AcademicLevel["SIX_HUNDRED"] = "600";
})(AcademicLevel || (exports.AcademicLevel = AcademicLevel = {}));
class CreateMaterialDto {
}
exports.CreateMaterialDto = CreateMaterialDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "fileUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AcademicLevel),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "academicLevel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(Semester),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "semester", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(MaterialType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "materialType", void 0);
//# sourceMappingURL=create-materials.dto.js.map