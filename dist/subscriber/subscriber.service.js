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
exports.SubscriberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscriber_entity_1 = require("./subscriber.entity");
let SubscriberService = class SubscriberService {
    constructor(subscriberRepo) {
        this.subscriberRepo = subscriberRepo;
    }
    async subscribe(dto) {
        const hasEmail = dto.email?.trim();
        const hasPhone = dto.phone?.trim();
        if (!hasEmail && !hasPhone) {
            throw new common_1.BadRequestException('Podaj email albo numer telefonu');
        }
        const matchId = dto.matchId.trim().toUpperCase();
        const email = hasEmail ? hasEmail : null;
        const phone = hasPhone ? hasPhone.replace(/\s/g, '') : null;
        const existing = await this.subscriberRepo.findOne({
            where: [
                ...(email ? [{ matchId, email }] : []),
                ...(phone ? [{ matchId, phone }] : []),
            ],
        });
        if (existing) {
            return {
                id: existing.id,
                message: 'Już jesteś zapisany na ten mecz.',
            };
        }
        const subscriber = this.subscriberRepo.create({
            email,
            phone,
            matchId,
        });
        const saved = await this.subscriberRepo.save(subscriber);
        return {
            id: saved.id,
            message: `Zapisano subskrypcję na mecz ${matchId}. O wolnych miejscach poinformujemy.`,
        };
    }
    async findByMatchId(matchId) {
        return this.subscriberRepo.find({
            where: { matchId },
            order: { createdAt: 'ASC' },
        });
    }
};
exports.SubscriberService = SubscriberService;
exports.SubscriberService = SubscriberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriberService);
//# sourceMappingURL=subscriber.service.js.map