import { Controller, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Data Management')
@ApiBearerAuth()
@Controller('data')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Delete('reset')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Reset user financial data (accounts, cards, expenses, earnings)',
  })
  @ApiResponse({
    status: 204,
    description: 'User data has been reset successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async resetUserData(@CurrentUser() user: User): Promise<void> {
    await this.dataService.resetUserData(user);
  }
}
