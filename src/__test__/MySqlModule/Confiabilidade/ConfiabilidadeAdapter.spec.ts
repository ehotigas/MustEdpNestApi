import { ConfiabilidadeAdapter, IConfiabilidadeAdapter } from "src/MySqlModule/Confiabilidade/ConfiabilidadeAdapter";
import { Confiabilidade } from "src/MySqlModule/Confiabilidade/Confiabilidade";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Providers } from "src/Providers";
import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { Region } from "src/types/Region";
import { InternalServerErrorException } from "@nestjs/common";

const confiabilidadeList = [
    new Confiabilidade({ Id: 0 })
];

describe('ConfiabilidadeAdapter', () => {
    let adapter: IConfiabilidadeAdapter;
    let repository: Repository<Confiabilidade>;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };

    const mockLogger = {
        getInstance: jest.fn().mockReturnValue({
            error: jest.fn()
        })
    };

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: Providers.CONFIABILIDADE_ADAPTER,
                    useClass: ConfiabilidadeAdapter
                },
                {
                    provide: getRepositoryToken(Confiabilidade),
                    useValue: mockRepository
                },
                {
                    provide: Providers.LOGGER_FACTORY,
                    useValue: mockLogger
                }
            ]
        }).compile();
        adapter = app.get<IConfiabilidadeAdapter>(Providers.CONFIABILIDADE_ADAPTER);
        repository = app.get<Repository<Confiabilidade>>(
            getRepositoryToken(Confiabilidade)
        );
    });
   
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a confiabilidade list successfully', async () => {
            mockRepository.find.mockResolvedValue(confiabilidadeList);
            const result = await adapter.findAll(Region.SP);
            expect(result).toEqual(confiabilidadeList);
            expect(repository.find).toHaveBeenCalledTimes(1);
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.find.mockRejectedValueOnce(new Error(""));
            await expect(
                adapter.findAll(Region.SP)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('find', () => {
        it('should return a confiabilidade successfully', async () => {
            mockRepository.findOne.mockResolvedValue(confiabilidadeList[0]);
            const result = await adapter.find(0);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(repository.findOne).toHaveBeenCalledTimes(1);
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.findOne.mockRejectedValueOnce(new Error(""));
            await expect(
                adapter.find(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('save', () => {
        it('should save and return a confiabilidade successfully', async () => {
            mockRepository.save.mockResolvedValue(confiabilidadeList[0]);
            let payload = new Confiabilidade();
            delete payload.Id;
            const result = await adapter.save(payload);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(repository.save).toHaveBeenCalledTimes(1);
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.save.mockRejectedValueOnce(new Error(""));
            let payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                adapter.save(payload)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('update', () => {
        it('should update and return a confiabilidade successfully', async () => {
            mockRepository.findOne.mockResolvedValue(confiabilidadeList[0]);
            mockRepository.save.mockResolvedValue(confiabilidadeList[0]);
            let payload = new Confiabilidade();
            delete payload.Id;
            const result = await adapter.update(0, payload);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledTimes(1);
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.findOne.mockRejectedValueOnce(new Error(""));
            let payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                adapter.update(0, payload)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.findOne.mockResolvedValue(confiabilidadeList[0]);
            mockRepository.save.mockRejectedValueOnce(new Error(""));
            let payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                adapter.update(0, payload)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('remove', () => {
        it('should remove and return a confiabilidade successfully', async () => {
            mockRepository.findOne.mockResolvedValue(confiabilidadeList[0]);
            mockRepository.remove.mockResolvedValue(confiabilidadeList[0]);
            const result = await adapter.remove(0);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.remove).toHaveBeenCalledTimes(1);
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.findOne.mockRejectedValueOnce(new Error(""));
            let payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                adapter.remove(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });

        it('should throw an internal server error exception', async () => {
            mockRepository.findOne.mockResolvedValue(confiabilidadeList[0]);
            mockRepository.remove.mockRejectedValueOnce(new Error(""));
            let payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                adapter.remove(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });
});