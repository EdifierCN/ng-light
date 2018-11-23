import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

/*
 .pipe(
   retry(3), // retry a failed request up to 3 times
   catchError(this.handleError) // then handle the error
 );
 );*/
export const handleError = (error: HttpErrorResponse) => {
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  return throwError(
    'Something bad happened; please try again later.');
};
