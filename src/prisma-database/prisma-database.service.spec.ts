import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabaseService } from './prisma-database.service';

describe('PrismaDatabaseService', () => {
  let service: PrismaDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaDatabaseService],
    }).compile();

    service = module.get<PrismaDatabaseService>(PrismaDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
