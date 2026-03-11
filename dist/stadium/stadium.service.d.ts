export interface SectorWithSeats {
    name: string;
    displayName: string;
    tribuneName: string;
    availableSeats: number;
}
export declare class StadiumService {
    getSectorsWithSeats(matchId: string): Promise<SectorWithSeats[]>;
}
