import { ApiProperty } from '@nestjs/swagger';

export class WebhookPayloadDto {
  @ApiProperty({
    description: 'Objeto enviado por la API de WhatsApp Cloud',
    example: 'whatsapp_business_account',
  })
  object: string;

  @ApiProperty({
    description: 'Estructura de entradas de mensajes y notificaciones',
    example: [
      {
        id: '123456789',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '573000000000',
                phone_number_id: '1234567890',
              },
              contacts: [
                {
                  profile: { name: 'Juan Vargas' },
                  wa_id: '573001234567',
                },
              ],
              messages: [
                {
                  from: '573001234567',
                  id: 'wamid.HBgL...',
                  timestamp: '1712345678',
                  text: { body: 'Quiero hacer un pedido' },
                  type: 'text',
                },
              ],
            },
            field: 'messages',
          },
        ],
      },
    ],
  })
  entry: any[];
}