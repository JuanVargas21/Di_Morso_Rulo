import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { PedidosService } from './pedidos.service.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { UpdatePedidoDto } from './dto/update-pedido.dto.js';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id')
update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
  // 1. Verificamos que el usuario haya enviado el estado en el body
  if (!updatePedidoDto.estado) {
    throw new BadRequestException('Debe proporcionar un estado válido para actualizar el pedido');
  }

  // 2. Al validar arriba, TypeScript sabe que updatePedidoDto.estado NO es undefined
  return this.pedidosService.cambiarEstado(id, updatePedidoDto.estado);
}

 @Delete(':id')
remove(@Param('id') id: string) {
  return this.pedidosService.cambiarEstado(id, 'Cancelado');
}
}
