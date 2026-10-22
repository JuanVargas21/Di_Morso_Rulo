import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service.js';
import { PedidosController } from './pedidos.controller.js';
import { ProductosModule } from '../productos/productos.module.js';

@Module({
  imports: [ProductosModule],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService], // 👈 AÑADIR ESTA LÍNEA PARA EXPONER EL SERVICIO
})
export class PedidosModule {}