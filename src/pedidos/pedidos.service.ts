import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { ProductosService } from '../productos/productos.service.js';

export interface ItemComanda {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  notas?: string;
}

export interface Pedido {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  direccionEntrega: string;
  origen: 'Manual' | 'WhatsApp';
  estado: 'Recibido' | 'EnPreparacion' | 'EnRuta' | 'Entregado' | 'Cancelado';
  metodoPago: 'Efectivo' | 'Nequi' | 'Transferencia';
  items: ItemComanda[];
  total: number;
  createdAt: Date;
}

export interface ComandaFormat {
  pedidoId: string;
  fecha: Date;
  cliente: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
  origen: string;
  metodoPago: string;
  items: ItemComanda[];
  total: number;
  textoComandaCocina: string; // Formato listo para enviar por WhatsApp o imprimir en ticket
}

@Injectable()
export class PedidosService {
  private pedidos: Pedido[] = [];

  constructor(private readonly productosService: ProductosService) {}

  create(createPedidoDto: CreatePedidoDto): Pedido {
    let totalPedido = 0;

    // Mapear items y calcular subtotales buscando el precio real del producto
    const itemsProcesados: ItemComanda[] = createPedidoDto.items.map((item) => {
      const producto = this.productosService.findOne(item.productoId);
      const subtotal = producto.precio * item.cantidad;
      totalPedido += subtotal;

      return {
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal,
        notas: item.notas,
      };
    });

    const nuevoPedido: Pedido = {
      id: `PED-${Date.now()}`,
      clienteNombre: createPedidoDto.clienteNombre,
      clienteTelefono: createPedidoDto.clienteTelefono,
      direccionEntrega: createPedidoDto.direccionEntrega,
      origen: createPedidoDto.origen,
      estado: 'Recibido',
      metodoPago: createPedidoDto.metodoPago,
      items: itemsProcesados,
      total: totalPedido,
      createdAt: new Date(),
    };

    this.pedidos.push(nuevoPedido);
    return nuevoPedido;
  }

  findAll(): Pedido[] {
    return this.pedidos;
  }

  findOne(id: string): Pedido {
    const pedido = this.pedidos.find((p) => p.id === id);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${id} no encontrado`);
    }
    return pedido;
  }

  cambiarEstado(
    id: string,
    nuevoEstado: 'Recibido' | 'EnPreparacion' | 'EnRuta' | 'Entregado' | 'Cancelado',
  ): Pedido {
    const pedido = this.findOne(id);
    pedido.estado = nuevoEstado;
    return pedido;
  }

  // ==========================================
  // LÓGICA Y GENERACIÓN DE COMANDA
  // ==========================================

  /**
   * Genera el objeto estructurado de comanda para un pedido específico,
   * incluyendo la versión formateada en texto plano para WhatsApp/Ticket de impresora.
   */
  generarComanda(id: string): ComandaFormat {
    const pedido = this.findOne(id);

    const lineasItems = pedido.items
      .map((item) => {
        const notaStr = item.notas ? `   └ *Nota:* ${item.notas}\n` : '';
        return `• ${item.cantidad}x ${item.nombreProducto} ($${item.subtotal.toLocaleString()})\n${notaStr}`;
      })
      .join('');

    const textoComandaCocina = 
`================================
      🍔 COMANDA DE COCINA 🍔
================================
ID Pedido: ${pedido.id}
Origen: ${pedido.origen}
Fecha: ${pedido.createdAt.toLocaleString()}

👤 CLIENTE:
- Nombre: ${pedido.clienteNombre}
- Teléfono: ${pedido.clienteTelefono}
- Dirección: ${pedido.direccionEntrega}

🛒 DETALLE DEL PEDIDO:
${lineasItems}
--------------------------------
💳 Método de Pago: ${pedido.metodoPago}
💰 TOTAL: $${pedido.total.toLocaleString()}
================================`;

    return {
      pedidoId: pedido.id,
      fecha: pedido.createdAt,
      cliente: {
        nombre: pedido.clienteNombre,
        telefono: pedido.clienteTelefono,
        direccion: pedido.direccionEntrega,
      },
      origen: pedido.origen,
      metodoPago: pedido.metodoPago,
      items: pedido.items,
      total: pedido.total,
      textoComandaCocina,
    };
  }
}