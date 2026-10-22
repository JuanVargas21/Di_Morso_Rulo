import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service.js';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('webhook')
  verificarWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.whatsappService.verificarWebhook(mode, token, challenge);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async recibirMensaje(@Body() body: any) {
    // ESTO OBLIGA A LA TERMINAL A MOSTRAR EL EVENTO RECIBIDO DE META
    console.log('================ PETICIÓN ENTRANTE DETECTADA ================');
    console.log(JSON.stringify(body, null, 2));
    console.log('===========================================================');

    return await this.whatsappService.procesarMensajeEntrante(body);
  }
}