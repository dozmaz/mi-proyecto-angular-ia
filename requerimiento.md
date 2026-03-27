# Requerimiento Reescrito y Plan de Desarrollo

## 1) Objetivo
Diseñar e implementar la aplicacion **Angular 21** `mi-proyecto-angular` con una arquitectura modular y escalable, incorporando autenticacion simple, gestion CRUD de tareas y pruebas unitarias, siguiendo buenas practicas de Angular/TypeScript y requisitos de accesibilidad WCAG AA.

## 2) Alcance funcional
La solucion debe incluir:

- Aplicacion base con configuracion principal y enrutamiento.
- Pantalla `Home` para listar tareas con campos `id`, `title`, `completed`.
- Operaciones CRUD de tareas mediante `HttpClient` contra `/api/todos` (con backend mock).
- Formulario para crear y editar tareas, con validaciones y mensajes de error accesibles.
- Flujo de autenticacion simple con `login/logout` persistido en `localStorage`.
- Documentacion en `README.md` con comandos para instalar, servir y ejecutar pruebas.

Fuera de alcance inicial:

- Integracion con backend real.
- Control de permisos por roles.
- Pruebas E2E.

## 3) Arquitectura objetivo (modular)
Se define una estructura por capas para separar responsabilidades:

```text
src/app/
  core/
    auth/
      auth.service.ts
      auth.guard.ts
    http/
      mock-todos.interceptor.ts
    layout/
      shell.component.ts
  shared/
    ui/
      empty-state.component.ts
      loading-indicator.component.ts
  features/
    auth/
      pages/login-page.component.ts
      auth.routes.ts
    todos/
      data-access/todo-api.service.ts
      models/todo.model.ts
      pages/home-page.component.ts
      ui/todo-form.component.ts
      todos.routes.ts
  app.config.ts
  app.routes.ts
  app.ts
```

Principios de arquitectura:

- **Core**: servicios singleton, guardias, interceptores y utilidades transversales.
- **Shared**: componentes reutilizables sin logica de negocio de dominio.
- **Features**: funcionalidad por dominio (`auth`, `todos`) con rutas lazy.
- **Lazy loading**: carga diferida de `features` para optimizar arranque.

## 4) Requisitos tecnicos y buenas practicas
Implementar con las siguientes reglas obligatorias:

- TypeScript en modo estricto (`strict`) y sin uso de `any`.
- Componentes standalone (default Angular 21).
- `ChangeDetectionStrategy.OnPush` en componentes de UI.
- Estado local con `signal()` y estado derivado con `computed()`.
- Uso de `input()` y `output()` para entradas/salidas de componentes.
- Plantillas con control flow nativo: `@if`, `@for`, `@switch`.
- No usar `ngClass` ni `ngStyle`; usar bindings de `class` y `style`.
- Servicios con `providedIn: 'root'` e `inject()` para DI.
- Rutas por feature y proteccion con guard para rutas autenticadas.

## 5) Requisitos funcionales detallados
### 5.1 Autenticacion
- Ruta publica `/login` con formulario reactivo.
- Login valido: guarda sesion en `localStorage`, actualiza estado y redirige a `Home`.
- Logout: limpia sesion, estado y redirige a `/login`.
- Guard de autenticacion para bloquear rutas privadas sin sesion.

### 5.2 Gestion de tareas
- Listado en `Home` mostrando `id`, `title`, `completed`.
- Alta de tarea con titulo obligatorio.
- Edicion de tarea existente.
- Eliminacion de tarea con feedback al usuario.
- Marcar/desmarcar completada.

### 5.3 API mock `/api/todos`
- `GET /api/todos` -> lista de tareas.
- `POST /api/todos` -> crear tarea.
- `PUT /api/todos/:id` -> actualizar tarea.
- `DELETE /api/todos/:id` -> eliminar tarea.
- Mock implementado mediante interceptor para evitar dependencia de backend real.

## 6) Accesibilidad (WCAG AA)
La implementacion debe:

- Cumplir validaciones AXE sin errores criticos.
- Garantizar contraste minimo AA en texto y controles.
- Asociar correctamente `label` con controles de formulario.
- Exponer errores de validacion de forma accesible (`aria-live`, `aria-invalid`, `aria-describedby`).
- Asegurar navegacion completa por teclado y foco visible.

## 7) Estrategia de pruebas unitarias
Se deben incluir pruebas para:

- **Servicios**:
  - `AuthService`: login, logout, persistencia en `localStorage`.
  - `TodoApiService`: llamadas HTTP y endpoints esperados.
- **Guardias**:
  - `auth.guard`: permite o bloquea acceso segun sesion.
- **Componentes**:
  - `LoginPageComponent`: validacion de formulario y flujo de autenticacion.
  - `HomePageComponent`: render de lista y acciones CRUD.
  - `TodoFormComponent`: validaciones y emisiones de datos.

Criterio sugerido de cobertura:

- Cobertura global minima: **80%** en lineas/branches.
- Cobertura en piezas criticas (`auth`, `todo-api`, `guard`): **90%**.

## 8) Plan de desarrollo por fases
### Fase 1 - Base del proyecto y arquitectura
- Definir estructura `core/shared/features`.
- Configurar rutas raiz y lazy loading por feature.
- Configurar `HttpClient` e interceptor mock.

### Fase 2 - Autenticacion
- Implementar `AuthService` con signals y `localStorage`.
- Crear pantalla de login y guard de proteccion.
- Implementar logout desde layout principal.

### Fase 3 - Feature de tareas
- Modelar entidad `Todo` y servicio de datos (`TodoApiService`).
- Implementar `Home` con listado y estados (`loading`, `empty`, `error`).
- Implementar `TodoFormComponent` para alta/edicion.

### Fase 4 - Calidad y accesibilidad
- Ajustar semantica HTML y ARIA.
- Revisar flujo de teclado y foco.
- Ejecutar pruebas AXE y corregir hallazgos.

### Fase 5 - Pruebas y documentacion
- Implementar suite unitaria de servicios, guard y componentes.
- Actualizar `README.md` con instrucciones de uso y pruebas.
- Ejecutar build y pruebas para validacion final.

## 9) Criterios de aceptacion
Se considera completado cuando:

- La app compila y corre en Angular 21 sin errores.
- El flujo login/logout funciona con persistencia en `localStorage`.
- El CRUD de tareas funciona contra `/api/todos` mock.
- El formulario de tareas valida correctamente y muestra errores accesibles.
- Las rutas privadas estan protegidas por guard.
- Existen pruebas unitarias ejecutables para servicios, guard y componentes clave.
- `README.md` incluye comandos de instalacion, ejecucion local y tests.

## 10) Comandos esperados en README
```bash
npm install
npm start
npm test
npm run build
```

