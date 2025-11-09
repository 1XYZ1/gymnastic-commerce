# BACKEND CART - PLAN MÍNIMO

> Lo básico para que el frontend pueda trabajar con el carrito

**Stack:** NestJS 10.3.8 + TypeORM + PostgreSQL
**Tiempo:** 2-3 horas

---

## GENERAR MÓDULO

```bash
nest g resource cart --no-spec
# Seleccionar: REST API, Yes para CRUD
```

---

## ENTIDADES

### cart.entity.ts
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @Column('decimal', { default: 0 })
  subtotal: number;

  @Column('decimal', { default: 0 })
  tax: number;

  @Column('decimal', { default: 0 })
  total: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
```

### cart-item.entity.ts
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartId: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column()
  size: string;

  @Column('decimal')
  priceAtTime: number;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  // Relación con Product (agregar después)
  @Column('json', { nullable: true })
  product: any; // Guardar snapshot del producto
}
```

---

## DTOs

### add-cart-item.dto.ts
```typescript
import { IsUUID, IsInt, Min, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  size: string;
}
```

### update-cart-item.dto.ts
```typescript
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
```

---

## CONTROLLER

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Req() req, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:itemId')
  updateItem(@Req() req, @Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.id, itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(@Req() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
```

---

## SERVICE (LÓGICA BÁSICA)

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private itemRepo: Repository<CartItem>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items']
    });

    if (!cart) {
      cart = await this.cartRepo.save({ userId, items: [] });
    }

    this.calculateTotals(cart);
    return this.cartRepo.save(cart);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getCart(userId);

    // TODO: Obtener producto real de la BD
    const productMock = {
      id: dto.productId,
      title: 'Product',
      price: 29.99,
      stock: 10,
      images: []
    };

    const item = this.itemRepo.create({
      cartId: cart.id,
      productId: dto.productId,
      quantity: dto.quantity,
      size: dto.size,
      priceAtTime: productMock.price,
      product: productMock, // Guardar snapshot
    });

    await this.itemRepo.save(item);
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    await this.itemRepo.update(itemId, { quantity: dto.quantity });
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await this.itemRepo.delete(itemId);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.itemRepo.delete({ cartId: cart.id });
    return this.getCart(userId);
  }

  private calculateTotals(cart: Cart) {
    const subtotal = cart.items.reduce((sum, item) =>
      sum + (item.priceAtTime * item.quantity), 0
    );
    cart.subtotal = subtotal;
    cart.tax = subtotal * 0.16;
    cart.total = cart.subtotal + cart.tax;
  }
}
```

---

## SQL (CREAR TABLAS)

```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity INT NOT NULL,
  size VARCHAR(10) NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  product JSON
);
```

---

## MODULE

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
```

---

## RESPUESTAS DE API

### GET /api/cart
```json
{
  "id": "uuid",
  "userId": "uuid",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "size": "M",
      "priceAtTime": 29.99,
      "product": {
        "id": "uuid",
        "title": "Nike Air",
        "price": 29.99,
        "stock": 10,
        "images": []
      }
    }
  ],
  "subtotal": 59.98,
  "tax": 9.60,
  "total": 69.58,
  "updatedAt": "2025-11-01T12:00:00Z"
}
```

---

## TESTING RÁPIDO

```bash
# 1. Obtener carrito
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer {token}"

# 2. Agregar item
curl -X POST http://localhost:3000/api/cart/items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"productId":"uuid","quantity":1,"size":"M"}'

# 3. Actualizar
curl -X PATCH http://localhost:3000/api/cart/items/{itemId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}'

# 4. Eliminar
curl -X DELETE http://localhost:3000/api/cart/items/{itemId} \
  -H "Authorization: Bearer {token}"
```

---

## CHECKLIST

- [ ] Generar módulo con CLI
- [ ] Crear entidades Cart y CartItem
- [ ] Crear DTOs
- [ ] Ejecutar SQL para crear tablas
- [ ] Implementar service básico
- [ ] Configurar controller con guards
- [ ] Importar CartModule en AppModule
- [ ] Probar endpoints con curl/Postman

---

**Listo para trabajar en frontend después de completar estos pasos**
