import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Todo } from '../../features/todos/models/todo.model';

const API_PREFIX = '/api/todos';
const MOCK_LATENCY_MS = 150;

let todosStore: Todo[] = [
  { id: 1, title: 'Configurar estructura base', completed: true },
  { id: 2, title: 'Implementar routing lazy', completed: false },
];
let nextTodoId = 3;

function isTodosEndpoint(url: string): boolean {
  return url === API_PREFIX || url.startsWith(`${API_PREFIX}/`);
}

function parseIdFromUrl(url: string): number | null {
  const [, idSegment] = url.split(`${API_PREFIX}/`);
  if (!idSegment) {
    return null;
  }

  const parsed = Number(idSegment);
  return Number.isInteger(parsed) ? parsed : null;
}

//
function toResponse<T>(body: T, status = 200): Observable<HttpEvent<T>> {
  return of(new HttpResponse<T>({ status, body })).pipe(delay(MOCK_LATENCY_MS));
}

function handleGetTodos(): Observable<HttpEvent<Todo[]>> {
  return toResponse([...todosStore]);
}

function handleCreateTodo(request: HttpRequest<Partial<Todo>>): Observable<HttpEvent<Todo>> {
  const body = request.body;
  if (!body?.title?.trim()) {
    return toResponse({ id: -1, title: 'Titulo requerido', completed: false }, 400);
  }

  const createdTodo: Todo = {
    id: nextTodoId++,
    title: body.title.trim(),
    completed: Boolean(body.completed),
  };
  todosStore = [...todosStore, createdTodo];

  return toResponse(createdTodo, 201);
}

function handleUpdateTodo(
  request: HttpRequest<Partial<Todo>>,
  todoId: number,
): Observable<HttpEvent<Todo>> {
  const todoIndex = todosStore.findIndex((todo) => todo.id === todoId);
  if (todoIndex < 0) {
    return toResponse({ id: todoId, title: 'No encontrado', completed: false }, 404);
  }

  const current = todosStore[todoIndex];
  const updated: Todo = {
    ...current,
    title: request.body?.title?.trim() ?? current.title,
    completed: request.body?.completed ?? current.completed,
  };

  todosStore = todosStore.map((todo) => (todo.id === todoId ? updated : todo));
  return toResponse(updated);
}

function handleDeleteTodo(todoId: number): Observable<HttpEvent<null>> {
  const exists = todosStore.some((todo) => todo.id === todoId);
  if (!exists) {
    return toResponse(null, 404);
  }

  todosStore = todosStore.filter((todo) => todo.id !== todoId);
  return toResponse(null, 204);
}

export const mockTodosInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (!isTodosEndpoint(request.url)) {
    return next(request);
  }

  if (request.method === 'GET' && request.url === API_PREFIX) {
    return handleGetTodos();
  }

  if (request.method === 'POST' && request.url === API_PREFIX) {
    return handleCreateTodo(request as HttpRequest<Partial<Todo>>);
  }

  const todoId = parseIdFromUrl(request.url);
  if (todoId === null) {
    return next(request);
  }

  if (request.method === 'PUT') {
    return handleUpdateTodo(request as HttpRequest<Partial<Todo>>, todoId);
  }

  if (request.method === 'DELETE') {
    return handleDeleteTodo(todoId);
  }

  return next(request);
};

