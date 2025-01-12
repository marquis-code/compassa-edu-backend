"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterialDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_materials_dto_1 = require("./create-materials.dto");
class UpdateMaterialDto extends (0, mapped_types_1.PartialType)(create_materials_dto_1.CreateMaterialDto) {
}
exports.UpdateMaterialDto = UpdateMaterialDto;
//# sourceMappingURL=update-materials.dto.js.map