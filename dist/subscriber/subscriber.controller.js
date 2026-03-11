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
exports.SubscriberController = void 0;
const common_1 = require("@nestjs/common");
const subscriber_service_1 = require("./subscriber.service");
const subscribe_dto_1 = require("./dto/subscribe.dto");
let SubscriberController = class SubscriberController {
    constructor(subscriberService) {
        this.subscriberService = subscriberService;
    }
    async subscribe(dto) {
        return this.subscriberService.subscribe(dto);
    }
};
exports.SubscriberController = SubscriberController;
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_dto_1.SubscribeDto]),
    __metadata("design:returntype", Promise)
], SubscriberController.prototype, "subscribe", null);
exports.SubscriberController = SubscriberController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [subscriber_service_1.SubscriberService])
], SubscriberController);
//# sourceMappingURL=subscriber.controller.js.map