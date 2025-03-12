import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({
    status: 201,
    description: 'The card has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: CreateCardDto })
  create(@Body() createCardDto: CreateCardDto, @CurrentUser() user: User) {
    return this.cardService.create(createCardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cards for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of all cards for the current user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@CurrentUser() user: User) {
    return this.cardService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The card details.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.cardService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a card by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCardDto })
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @CurrentUser() user: User,
  ) {
    return this.cardService.update(id, updateCardDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card by ID for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The card has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.cardService.remove(id, user);
  }
}
