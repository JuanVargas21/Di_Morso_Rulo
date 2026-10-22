import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PedidosService } from '../pedidos/pedidos.service.js';
import axios from 'axios'; // 👈 Importación obligatoria para contactar a Meta

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly pedidosService: PedidosService) {}

  verificarWebhook(mode: string, token: string, challenge: string): string {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'dimorso_rulo_token_seguro_2026';

    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook de WhatsApp verificado con éxito');
      return challenge;
    }
    throw new ForbiddenException('Token de verificación inválido');
  }

  async procesarMensajeEntrante(payload: any) {
    try {
      const entry = payload.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      // Si es una notificación de estado (delivered/read), no procesamos la comanda
      if (!message) {
        this.logger.log('Notificación de estado (sin mensaje de cliente) recibida.');
        return { status: 'EVENT_RECEIVED_NO_MESSAGE' };
      }

      // Procesar si contiene texto del cliente
      const clienteTelefono = message.from;
      const clienteNombre = value.contacts?.[0]?.profile?.name || 'Cliente';
      const mensajeTexto = message.text?.body || '';

      this.logger.log(`Mensaje entrante de ${clienteNombre} (${clienteTelefono}): "${mensajeTexto}"`);

      // 1. Guardar el pedido en PedidosService
      const nuevoPedido = this.pedidosService.create({
        clienteNombre,
        clienteTelefono,
        direccionEntrega: 'Dirección por confirmar en chat',
        origen: 'WhatsApp',
        metodoPago: 'Efectivo',
        items: [
          {
            productoId: 'PROD-001',
            cantidad: 1,
            notas: `Mensaje: "${mensajeTexto}"`,
          },
        ],
      });

      // 2. Generar el formato de la comanda
      const comanda = this.pedidosService.generarComanda(nuevoPedido.id);

      // 3. Imprimir la comanda en consola
      console.log('\n==================================================');
      console.log(comanda.textoComandaCocina);
      console.log('==================================================\n');
      
      // 4. Enviar la confirmación al celular del cliente (Asterisco corregido)
      const mensajeConfirmacion = `¡Hola ${clienteNombre}! 👋\n\nTu pedido *#${nuevoPedido.id}* por 1x Lasagna de Pasta Mixta ha sido recibido y ya está preparándose en cocina 👨‍🍳.\n\nEn un momento te contactamos para coordinar los detalles del envío hacia Buenos Aires.\n\nTotal a pagar: $25,000.\n¡Gracias por elegir DiMorso Rulo! 🍕`;
      
      await this.enviarMensajeTexto(clienteTelefono, mensajeConfirmacion);

      return { status: 'SUCCESS' };
    } catch (error) {
      this.logger.error('Error al procesar comanda', error);
      return { status: 'ERROR' };
    }
  }

  // 👇 NUEVO MÉTODO: Ejecuta la petición HTTP hacia la API de WhatsApp
  private async enviarMensajeTexto(numeroDestino: string, textoMensaje: string) {
    try {
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN; 
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID; 

      if (!accessToken || !phoneNumberId) {
        this.logger.error('Faltan credenciales WHATSAPP_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID en el archivo .env');
        return;
      }

      await axios.post(
        `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          type: 'text',
          text: { body: textoMensaje },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`✅ Mensaje de confirmación enviado exitosamente a ${numeroDestino}`);
    } catch (error: any) {
      this.logger.error(
        '❌ Error enviando la respuesta a Meta',
        error.response?.data || error.message,
      );
    }
  }
}