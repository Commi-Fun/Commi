import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiCode } from "./status_code"

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                return {
                    code: ApiCode.SUCCESS,
                    message: "success",
                    data: data,
                };
            })
        );
    }
}