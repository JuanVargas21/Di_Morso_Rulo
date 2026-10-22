import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Producto } from './entities/producto.entity.js';

// Enums para organizar las categorías y proteínas del menú de tu amiga
export enum CategoriaMenu {
  LASAGNA_PASTA = 'Lasagna de Pasta',
  LASAGNA_MADURO = 'Lasagna de Maduro',
  PANINI = 'Panini',
}

export enum TipoProteina {
  CARNE = 'Carne Molida',
  POLLO = 'Pollo',
  MIXTA = 'Mixta (Carne y Pollo)',
  CARNE_DESMECHADA = 'Carne Desmechada',
}

@Injectable()
export class ProductosService {
  // Precargamos el menú directamente en memoria para que no esté vacío
  private productos: any[] = [
    {
      id: 'PROD-001', // 👈 Este es el ID exacto que busca WhatsappService
      nombre: 'Lasagna de Pasta Mixta',
      categoria: CategoriaMenu.LASAGNA_PASTA,
      proteina: TipoProteina.MIXTA,
      precio: 25000,
      disponible: true,
      createdAt: new Date(),
    },
    {
      id: 'PROD-002',
      nombre: 'Lasagna de Maduro con Carne',
      categoria: CategoriaMenu.LASAGNA_MADURO,
      proteina: TipoProteina.CARNE,
      precio: 27000,
      disponible: true,
      createdAt: new Date(),
    },
    {
      id: 'PROD-003',
      nombre: 'Panini de Carne Desmechada',
      categoria: CategoriaMenu.PANINI,
      proteina: TipoProteina.CARNE_DESMECHADA,
      precio: 18000,
      disponible: true,
      createdAt: new Date(),
    },
    {
      id: 'PROD-004',
      nombre: 'Panini de Pollo',
      categoria: CategoriaMenu.PANINI,
      proteina: TipoProteina.POLLO,
      precio: 17000,
      disponible: true,
      createdAt: new Date(),
    }
  ];

  create(createProductoDto: CreateProductoDto): Producto {
    const nuevoProducto: any = {
      id: `PROD-00${this.productos.length + 1}`,
      ...createProductoDto,
      disponible: createProductoDto.disponible ?? true,
      createdAt: new Date(),
    };
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  findAll(): Producto[] {
    return this.productos;
  }

  findOne(id: string): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  update(id: string, updateProductoDto: UpdateProductoDto): Producto {
    const producto = this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return producto;
  }

  remove(id: string): void {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    this.productos.splice(index, 1);
  }
}