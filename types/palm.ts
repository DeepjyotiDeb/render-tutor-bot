export interface PalmModel {
    id: string;
    name: string;
    tokenLimit: number;
}

export enum PalmModelID {
    palm = 'text-bison@001'
}

 export const PalmAIModels: Record<PalmModelID, PalmModel> = {
    [PalmModelID.palm]:{
        id: PalmModelID.palm,
        name: 'text-bison@001',
        tokenLimit: 1024
    }
 }