import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { map, switchMap, retry } from "rxjs/operators";

import { environment } from "src/environments/environment";

import { AuthService } from "../services/auth.service";

const URL: string = environment.url;

@Injectable({
  providedIn: "root"
})
export class UniqueValidator {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private searchUniques(value) {
    // debounce
    return timer(500).pipe(
      switchMap(() => {
        // Check if unique data is available
        return this.http.post<any>(`${URL}user/signup_check`, value);
      })
    );
  }

  uniqueUsernameValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.searchUniques({ username: control.value }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          }
        }),
        retry()
      );
    };
  }

  uniqueEmailValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null | Promise<any>> => {
      return this.searchUniques({ email_id: control.value }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          }
        }),
        retry()
      );
    };
  }

  uniquePhoneNumberValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.searchUniques({ phone_number: control.value }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          }
        }),
        retry()
      );
    };
  }

  private searchUniquesForUpdate(value) {
    // debounce
    return timer(500).pipe(
      switchMap(() => {
        // Check if unique data is available
        return this.http.post<any>(`${URL}user/update_check`, value);
      })
    );
  }

  uniqueUsernameValidatorWhileUpdating(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> | Promise<any> => {
      return this.searchUniquesForUpdate({
        username: control.value,
        for: "username"
      }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          } else {
            return;
          }
        }),
        retry()
      );
    };
  }

  uniqueEmailValidatorWhileUpdating(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> | Promise<any> => {
      return this.searchUniquesForUpdate({
        email_id: control.value,
        for: "email"
      }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          } else {
            return;
          }
        }),
        retry()
      );
    };
  }

  uniquePhoneNumberValidatorWhileUpdating(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> | Promise<any> => {
      return this.searchUniquesForUpdate({
        phone_number: control.value,
        for: "phone"
      }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          } else {
            return;
          }
        }),
        retry()
      );
    };
  }
}
