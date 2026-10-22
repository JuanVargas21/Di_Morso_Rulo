import { ApiProperty } from '@nestjs/swagger';

class ItemPedidoDto {
  @ApiProperty({ description: 'ID del producto/plato', example: '17123456789' })
  productoId: string;

  @ApiProperty({ description: 'Cantidad solicitada', example: 2 })
  cantidad: number;

  @ApiProperty({ description: 'Notas específicas del plato', example: 'Sin salsa picante', required: false })
  notas?: string;
}

export class CreatePedidoDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Vargas' })
  clienteNombre: string;

  @ApiProperty({ description: 'Teléfono de contacto', example: '3001234567' })
  clienteTelefono: string;

  @ApiProperty({ description: 'Dirección de entrega', example: 'Calle 50 # 30 - 12, Buenos Aires' })
  direccionEntrega: string;

  @ApiProperty({ description: 'Canal de origen', example: 'Manual', enum: ['Manual', 'WhatsApp'] })
  origen: 'Manual' | 'WhatsApp';

  @ApiProperty({ description: 'Método de pago', example: 'Nequi', enum: ['Efectivo', 'Nequi', 'Transferencia'] })
  metodoPago: 'Efectivo' | 'Nequi' | 'Transferencia';

  @ApiProperty({ description: 'Lista de productos que componen el pedido', type: [ItemPedidoDto] })
  items: ItemPedidoDto[];
}
