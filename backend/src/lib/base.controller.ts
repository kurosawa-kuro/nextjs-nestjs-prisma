// src\lib\base.controller.ts

import {
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
  Param,
  Body,
  Post,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('base')
export class BaseController<T> {
  constructor(
    private readonly service: any,
    private readonly modelName: string,
  ) {
    if (!modelName) {
      throw new Error('modelName must be provided');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 201, description: 'Entity successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createDto: T) {
    try {
      const created = await this.service.create(createDto);
      if (!created) {
        throw new BadRequestException(`Failed to create ${this.modelName}`);
      }
      return created;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create ${this.modelName}: ${error.message}`,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'Return all entities.',
    type: [Object],
  })
  async index() {
    return await this.service.all();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an entity by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Entity ID' })
  @ApiResponse({
    status: 200,
    description: 'Entity successfully retrieved.',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  async show(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.find(id);
    if (!result) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an entity by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Entity ID' })
  @ApiBody({ type: Object })
  @ApiResponse({
    status: 200,
    description: 'Entity successfully updated.',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: T) {
    const result = await this.service.update(id, updateDto);
    if (!result) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entity by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Entity ID' })
  @ApiResponse({ status: 200, description: 'Entity successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  async destroy(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.destroy(id);
    if (!result) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return { message: `${this.modelName} successfully deleted` };
  }
}
