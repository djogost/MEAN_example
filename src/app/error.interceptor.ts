import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ErrorComponent} from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        /*console.log(error);
        alert(error.error.message);*/
        let errorMessage = 'An unknown error occurred!';
        if (error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);
      })
    );
  }
}
