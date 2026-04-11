import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const tenantId = localStorage.getItem('tenantId') || 'INVITADO';
    console.log("log on interceptor");
    
    const tenantId = 'test';
    const authReq = req.clone({
      headers: req.headers.set('X-Tenant-ID', tenantId)
    });

    return next.handle(authReq);
  }
}