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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const activity_schema_1 = require("./schemas/activity.schema");
const user_schema_1 = require("../user/user.schema");
let ActivityService = class ActivityService {
    constructor(activityModel, userModel) {
        this.activityModel = activityModel;
        this.userModel = userModel;
    }
    async create(createActivityDto, userId) {
        const createdActivity = new this.activityModel(Object.assign(Object.assign({}, createActivityDto), { user: userId }));
        const savedActivity = await createdActivity.save();
        await this.userModel.findByIdAndUpdate(userId, {
            $push: { activities: savedActivity._id },
        });
        return savedActivity;
    }
    async findAll(userId) {
        return this.activityModel.find({ user: userId }).exec();
    }
    async findOne(id, userId) {
        const activity = await this.activityModel
            .findOne({ _id: id, user: userId })
            .exec();
        if (!activity) {
            throw new common_1.NotFoundException(`Activity with ID ${id} not found`);
        }
        return activity;
    }
    async update(id, updateActivityDto, userId) {
        const updatedActivity = await this.activityModel
            .findOneAndUpdate({ _id: id, user: userId }, updateActivityDto, {
            new: true,
        })
            .exec();
        if (!updatedActivity) {
            throw new common_1.NotFoundException(`Activity with ID ${id} not found`);
        }
        return updatedActivity;
    }
    async delete(id, userId) {
        const result = await this.activityModel
            .findOneAndDelete({ _id: id, user: userId })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Activity with ID ${id} not found`);
        }
    }
    async findByUserId(userId) {
        return this.activityModel.find({ user: userId }).exec();
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_schema_1.Activity.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ActivityService);
//# sourceMappingURL=activity.service.js.map