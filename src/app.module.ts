import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈 Importa esto
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PedidosModule } from './pedidos/pedidos.module.js';
import { ProductosModule } from './productos/productos.module.js';
import { WhatsappModule } from './whatsapp/whatsapp.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 ESTO CARGA EL ARCHIVO .env AUTOMÁTICAMENTE
    PedidosModule,
    ProductosModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}