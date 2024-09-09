import { ConfiabilidadeService, IConfiabilidadeService } from "src/MySqlModule/Confiabilidade/ConfiabilidadeService";
import { IConfiabilidadeAdapter } from "src/MySqlModule/Confiabilidade/ConfiabilidadeAdapter";
import { Providers } from "src/Providers";
import { Test } from "@nestjs/testing";
import { Confiabilidade } from "src/MySqlModule/Confiabilidade/Confiabilidade";
import { Region } from "src/types/Region";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";

const confiabilidadeList = [
    new Confiabilidade({ Id: 0 })
];

const confiabilidadeDto = {
    confiabilidade: confiabilidadeList
};

describe('ConfiabilidadeService', () => {
    let service: IConfiabilidadeService;
    let adapter: IConfiabilidadeAdapter;

    const mockAdapter = {
        findAll: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockLogger = {
        getInstance: jest.fn().mockReturnValue({
            log: jest.fn(),
            warn: jest.fn(),
        })
    };

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: Providers.CONFIABILIDADE_SERVICE,
                    useClass: ConfiabilidadeService
                },
                {
                    provide: Providers.CONFIABILIDADE_ADAPTER,
                    useValue: mockAdapter
                },
                {
                    provide: Providers.LOGGER_FACTORY,
                    useValue: mockLogger
                },
            ]
        }).compile();
        service = app.get<IConfiabilidadeService>(Providers.CONFIABILIDADE_SERVICE);
        adapter = app.get<IConfiabilidadeAdapter>(Providers.CONFIABILIDADE_ADAPTER);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(adapter).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a confiabilidade list dto successfully', async () => {
            mockAdapter.findAll.mockResolvedValue(confiabilidadeList);
            const result = await service.findAll(Region.SP);
            expect(result).toEqual(confiabilidadeDto);
            expect(adapter.findAll).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.findAll.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                service.findAll(Region.SP)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('find', () => {
        it('should return a confiabilidade successfully', async () => {
            mockAdapter.find.mockResolvedValue(confiabilidadeList[0]);
            const result = await service.find(0);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(adapter.find).toHaveBeenCalledTimes(1);
        });

        it('should throw a not found exception', async () => {
            mockAdapter.find.mockResolvedValue(null);
            await expect(
                service.find(0)
            ).rejects.toThrow(
                new NotFoundException(`Fail to fetch Confiabilidade with id: 0. Not Found`)
            );
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.find.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                service.find(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('save', () => {
        it('should save and return a confiabilidade successfully', async () => {
            mockAdapter.save.mockResolvedValue(confiabilidadeList[0]);
            const payload = new Confiabilidade();
            delete payload.Id;
            const result = await service.save(payload);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(adapter.save).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.save.mockRejectedValueOnce(new InternalServerErrorException(""));
            const payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                service.save(payload)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('saveMany', () => {
        it('should save and return a confiabilidade list dto successfully', async () => {
            mockAdapter.save.mockResolvedValue(confiabilidadeList[0]);
            const payload = new Confiabilidade();
            delete payload.Id;
            const result = await service.saveMany({
                payload: [payload]
            });
            expect(result).toEqual(confiabilidadeDto);
            expect(adapter.save).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.save.mockRejectedValueOnce(new InternalServerErrorException(""));
            const payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                service.saveMany({ payload: [payload] })
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('update', () => {
        it('should update and return a confiabilidade successfully', async () => {
            mockAdapter.update.mockResolvedValue(confiabilidadeList[0]);
            const result = await service.update(0, {});
            expect(result).toEqual(confiabilidadeList[0]);
            expect(adapter.update).toHaveBeenCalledTimes(1);
        });

        it('should throw a not found exception', async () => {
            mockAdapter.update.mockResolvedValue(null);
            await expect(
                service.update(0, {})
            ).rejects.toThrow(
                new NotFoundException(`Fail to update Confiabilidade with id: 0. Not Found`)
            );
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.update.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                service.update(0, {})
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('remove', () => {
        it('should remove and return a confiabilidade successfully', async () => {
            mockAdapter.remove.mockResolvedValue(confiabilidadeList[0]);
            const result = await service.remove(0);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(adapter.remove).toHaveBeenCalledTimes(1);
        });

        it('should throw a not found exception', async () => {
            mockAdapter.remove.mockResolvedValue(null);
            await expect(
                service.remove(0)
            ).rejects.toThrow(
                new NotFoundException(`Fail to remove Confiabilidade with id: 0. Not Found`)
            );
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.remove.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                service.remove(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('removeAll', () => {
        it('should remove all database lines and return a confiabilidade list dto successfully', async () => {
            mockAdapter.findAll.mockResolvedValue(confiabilidadeList);
            mockAdapter.remove.mockResolvedValue(confiabilidadeList[0]);
            const result = await service.removeAll();
            expect(result).toEqual({
                confiabilidade: [...confiabilidadeList, ...confiabilidadeList]
            });
            expect(adapter.remove).toHaveBeenCalledTimes(2);
        });

        it('should throw internal server error exception', async () => {
            mockAdapter.findAll.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                service.removeAll()
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });
});