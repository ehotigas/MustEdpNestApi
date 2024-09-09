import { ConfiabilidadeController } from "src/MySqlModule/Confiabilidade/ConfiabilidadeController";
import { IConfiabilidadeService } from "src/MySqlModule/Confiabilidade/ConfiabilidadeService";
import { Confiabilidade } from "src/MySqlModule/Confiabilidade/Confiabilidade";
import { Providers } from "src/Providers";
import { Test } from "@nestjs/testing";
import { Region } from "src/types/Region";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";

const confiabilidadeList = [
    new Confiabilidade({ Id: 0 })
];

const confiabilidadeDto = {
    confiabilidade: confiabilidadeList
};

describe('ConfiabilidadeController', () => {
    let controller: ConfiabilidadeController;
    let service: IConfiabilidadeService;

    const mockService = {
        findAll: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
        saveMany: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeAll: jest.fn(),
    };

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                ConfiabilidadeController,
                {
                    provide: Providers.CONFIABILIDADE_SERVICE,
                    useValue: mockService
                }
            ]
        }).compile();
        controller = app.get<ConfiabilidadeController>(ConfiabilidadeController);
        service = app.get<IConfiabilidadeService>(Providers.CONFIABILIDADE_SERVICE);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a confiabilidade list dto successfully', async () => {
            mockService.findAll.mockResolvedValue(confiabilidadeDto);
            const result = await controller.getAll(Region.SP);
            expect(result).toEqual(confiabilidadeDto);
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockService.findAll.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                controller.getAll(Region.SP)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('find', () => {
        it('should return a confiabilidade successfully', async () => {
            mockService.find.mockResolvedValue(confiabilidadeList[0]);
            const result = await controller.get(0);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(service.find).toHaveBeenCalledTimes(1);
        });

        it('should throw not found exception', async () => {
            mockService.find.mockRejectedValueOnce(new NotFoundException(""));
            await expect(
                controller.get(0)
            ).rejects.toThrow(
                new NotFoundException("")
            );
        });

        it('should throw internal server error exception', async () => {
            mockService.find.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                controller.get(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('create', () => {
        it('should save and return a confiabilidade successfully', async () => {
            mockService.save.mockResolvedValue(confiabilidadeList[0]);
            const payload = new Confiabilidade();
            delete payload.Id;
            const result = await controller.create(payload);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(service.save).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockService.save.mockRejectedValueOnce(new InternalServerErrorException(""));
            const payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                controller.create(payload)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('createMany', () => {
        it('should save many and return a confiabilidade list dto successfully', async () => {
            mockService.saveMany.mockResolvedValue(confiabilidadeDto);
            const payload = new Confiabilidade();
            delete payload.Id;
            const result = await controller.createMany({ payload: [payload] });
            expect(result).toEqual(confiabilidadeDto);
            expect(service.saveMany).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockService.saveMany.mockRejectedValueOnce(new InternalServerErrorException(""));
            const payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                controller.createMany({ payload: [payload] })
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('patch', () => {
        it('should update and return a confiabilidade successfully', async () => {
            mockService.update.mockResolvedValue(confiabilidadeList[0]);
            const result = await controller.patch(0, {});
            expect(result).toEqual(confiabilidadeList[0]);
            expect(service.update).toHaveBeenCalledTimes(1);
        });

        it('should throw not found exception', async () => {
            mockService.update.mockRejectedValueOnce(new NotFoundException(""));
            await expect(
                controller.patch(0, {})
            ).rejects.toThrow(
                new NotFoundException("")
            );
        });

        it('should throw internal server error exception', async () => {
            mockService.update.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                controller.patch(0, {})
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('delete', () => {
        it('should delete and return a confiabilidade successfully', async () => {
            mockService.remove.mockResolvedValue(confiabilidadeList[0]);
            const result = await controller.delete(0);
            expect(result).toEqual(confiabilidadeList[0]);
            expect(service.remove).toHaveBeenCalledTimes(1);
        });

        it('should throw not found exception', async () => {
            mockService.remove.mockRejectedValueOnce(new NotFoundException(""));
            await expect(
                controller.delete(0)
            ).rejects.toThrow(
                new NotFoundException("")
            );
        });

        it('should throw internal server error exception', async () => {
            mockService.remove.mockRejectedValueOnce(new InternalServerErrorException(""));
            await expect(
                controller.delete(0)
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });

    describe('deleteMany', () => {
        it('should delete all records and return a confiabilidade list dto successfully', async () => {
            mockService.removeAll.mockResolvedValue(confiabilidadeDto);
            const result = await controller.removeAll();
            expect(result).toEqual(confiabilidadeDto);
            expect(service.removeAll).toHaveBeenCalledTimes(1);
        });

        it('should throw internal server error exception', async () => {
            mockService.removeAll.mockRejectedValueOnce(new InternalServerErrorException(""));
            const payload = new Confiabilidade();
            delete payload.Id;
            await expect(
                controller.removeAll()
            ).rejects.toThrow(
                new InternalServerErrorException("")
            );
        });
    });
});