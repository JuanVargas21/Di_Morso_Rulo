import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ description: 'Nombre del plato/producto', example: 'Lasagna de Carne' })
  nombre: string;

  @ApiProperty({ description: 'Descripción detallada', example: 'Lasagna artesanal con queso mozzarella y salsa boloñesa' })
  descripcion: string;

  @ApiProperty({ description: 'Precio/Costo de venta', example: 25000 })
  precio: number;

  @ApiProperty({ 
    description: 'Lista de ingredientes', 
    example: ['Pasta lasagna', 'Carne molida', 'Queso mozzarella', 'Salsa boloñesa'],
    type: [String] 
  })
  ingredientes: string[];

  @ApiProperty({ description: 'Indica si está disponible para la venta', example: true, default: true })
  disponible?: boolean;
}
