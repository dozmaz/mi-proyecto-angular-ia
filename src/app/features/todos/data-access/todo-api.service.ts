import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/todos';

  list(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.endpoint);
  }

  create(payload: Pick<Todo, 'title' | 'completed'>): Observable<Todo> {
    return this.http.post<Todo>(this.endpoint, payload);
  }

  update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.endpoint}/${todo.id}`, todo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}

