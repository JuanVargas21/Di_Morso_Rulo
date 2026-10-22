import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service.js';
import { WhatsappController } from './whatsapp.controller.js';
import { PedidosModule } from '../pedidos/pedidos.module.js'; // 👈 IMPORTAR EL MÓDULO DE PEDIDOS

@Module({
  imports: [PedidosModule], // 👈 AÑADIR AQUÍ EN IMPORTS
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
