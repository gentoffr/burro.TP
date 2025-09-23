
==== ORGANIZACION ====

src/
 ├── app/
 │    ├── core/                # Servicios, guards, interceptores, modelos
 │    │    ├── models/
 │    │    │     └── usuario.model.ts #--> clase base almacenadora de atributos usuario
 │    │    │     └── mesa.model.ts #--> clase base almacenadora de atributos mesa
 │    │    │     └── pedido.model.ts #--> clase base almacenadora de atributos pedidos
 │    │    ├── services/
 │    │    │     └── auth.service.ts #--> servicio de autenticacion
 │    │    │     └── usuario.service.ts #--> crud de usuarios, aprob de clientes
 │    │    │     └── pedidos.service.ts #--> crud de pedidos
 │    │    │     └── qr.service.ts #--> generacion de qrs
 │    │    ├── guards/
 │    │    │     └── auth.guard.ts #--> middleware de rutas
 │    │    └── interceptors/
 │    │          └── token.interceptor.ts --> para el java web token
 │    │
 │    ├── features/            # Módulos funcionales (lazy load), aca si van componentes visuales
 │    │    ├── auth/ #--> lo que implique autenticacion, es decir login y registro
 │    │    │     └── login.page.ts
 │    │    │     └── register.page.ts
 │    │    ├── usuarios/ #--> pantallas que permitan editar usuarios, probablemente accesibles a dueños/supervisores
 │    │    │     └── listado-usuarios.page.ts #--> listado de todos los usuarios, componente de  @Input
 │    │    │     └── detalle-usuario.page.ts #--> componente de un usuario detallado, probablemente accesible con url/user:id
 │    │    ├── mesas/ #--> lo mismo que el anterior pero para mesas
 │    │    │     └── listado-mesas.page.ts
 │    │    │     └── detalle-mesa.page.ts
 │    │    ├── pedidos/ #--> lo mismo que el anterior pero para pedidos
 │    │    │     └── pedido.page.ts
 │    │    │     └── estado-pedido.page.ts
 │    │    ├── encuestas/ #--> este va a revelar cualquier encuesta necesaria
 │    │    │     └── encuesta.page.ts
 │    │    │     └── resultados.page.ts
 │    │    ├── juegos/ #--> aca los juegos que sabe dios cuales seran
 │    │    │     └── juego1.page.ts
 │    │    │     └── juego2.page.ts
 │    │    │     └── juego3.page.ts
 │    │    └── notificaciones/
 │    │          └── push-handler.service.ts #--> servicio de notificaciones push
 │    │
 │    ├── shared/              # Componentes reutilizables, como seria un spinner
 │    │    ├── components/ 
 │    │    │     └── header.component.ts
 │    │    │     └── usuario-card.component.ts #--> carta de info de usuario, se le pasa un usuario y entrega todo
 │    │    │     └── qr-generator.component.ts
 │    │    └── directives/     # Directivas útiles
 │    │
 │    └── app.component.ts
 │
 └── assets/ --> desde aca se va a componer el splash
      ├── icons/
      ├── sounds/
      └── qrs/

Esta sera la estructura basica del proyecto, yo voy a inicializarlo asi pero vacío.

=== TAREAS al 19/09/25 === 

# Para el domingo 21/09/25 tienen que estar completos los siguientes modulos

-> Francisco: splash, icono de app y auth.service 

-> Juan Cruz: usuario.model

-> Lucas: mesa.model

=== CHECK al 23/09/2025 ===

-> Juan Cruz: deprecated
-> Francisco: splash e icono creados y commiteados
-> Lucas: usuario.model, mesa.model creados, no commiteados

=== TAREAS al 23/09/25 ===
# Para el jueves 25 tienen que estar completos los siguientes modulos

-> Francisco: auth.service, base de datos relacional en supabase
-> Lucas: vista login.component, vista register.component, generacion de qrs
