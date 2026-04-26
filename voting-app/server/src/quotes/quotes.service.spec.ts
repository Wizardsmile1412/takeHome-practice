import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesRespository } from './quotes.repository';

const mockQuotesRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  hasVoted: jest.fn(),
  vote: jest.fn(),
};

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        { provide: QuotesRespository, useValue: mockQuotesRepo },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  describe('vote()', () => {
    it('throws NotFoundException when quote does not exist', async () => {
      //Arrange: findById คืน null -> quote ไม่มีในระบบ
      mockQuotesRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.vote(1, 99)).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user already voted', async () => {
      mockQuotesRepo.findById.mockResolvedValue({
        id: 1,
        text: 'hello',
        voteCount: 0,
      });
      mockQuotesRepo.hasVoted.mockResolvedValue(true);

      // Act & Assert
      await expect(service.vote(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('returns updated quote when vote is cast', async () => {
      // Arrange: ผ่านทุก step
      const quote = { id: 1, text: 'hello', voteCount: 0 };
      mockQuotesRepo.findById.mockResolvedValue(quote);
      mockQuotesRepo.hasVoted.mockResolvedValue(false);
      mockQuotesRepo.vote.mockResolvedValue({ ...quote, voteCount: 1 });

      // Act
      const result = await service.vote(1, 1);

      // Assert
      expect(result.voteCount).toBe(1);
      expect(mockQuotesRepo.vote).toHaveBeenCalledWith(1, quote);
    });
  });
});
