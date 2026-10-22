import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto.js';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @ApiProperty({
    description: 'Estado de la comanda',
    example: 'EnPreparacion',
    enum: ['Recibido', 'EnPreparacion', 'EnRuta', 'Entregado', 'Cancelado'],
    required: false,
  })
  estado?: 'Recibido' | 'EnPreparacion' | 'EnRuta' | 'Entregado' | 'Cancelado';
}
