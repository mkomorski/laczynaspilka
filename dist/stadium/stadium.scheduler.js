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
exports.StadiumScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const stadium_service_1 = require("./stadium.service");
const subscriber_service_1 = require("../subscriber/subscriber.service");
const DEFAULT_MATCH_ID = 'PLAL26';
let StadiumScheduler = class StadiumScheduler {
    constructor(stadiumService, subscriberService) {
        this.stadiumService = stadiumService;
        this.subscriberService = subscriberService;
    }
    async checkStadium() {
        const matchId = process.env.MATCH_ID ?? DEFAULT_MATCH_ID;
        try {
            const sectors = await this.stadiumService.getSectorsWithSeats(matchId);
            if (sectors.length > 0) {
                const ts = new Date().toISOString();
                console.log(`[${ts}] Mecz ${matchId}: wolne miejsca w ${sectors.length} sektorach`);
                sectors.forEach((s) => {
                    console.log(`  - ${s.displayName} (${s.tribuneName}): ${s.availableSeats} miejsc`);
                });
                const subscribers = await this.subscriberService.findByMatchId(matchId);
                if (subscribers.length > 0) {
                    console.log(`  Subskrybenci do powiadomienia: ${subscribers.length}`);
                }
            }
        }
        catch (err) {
            console.error(`[${new Date().toISOString()}] Błąd odpytywania ${matchId}:`, err.message);
        }
    }
};
exports.StadiumScheduler = StadiumScheduler;
__decorate([
    (0, schedule_1.Cron)('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StadiumScheduler.prototype, "checkStadium", null);
exports.StadiumScheduler = StadiumScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stadium_service_1.StadiumService,
        subscriber_service_1.SubscriberService])
], StadiumScheduler);
//# sourceMappingURL=stadium.scheduler.js.map