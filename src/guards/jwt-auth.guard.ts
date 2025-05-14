import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true; // allows anonymous access for endpoints decorated with @Public()
    }

    const result = super.canActivate(context);

    if (result instanceof Promise) {
      return result.then((res) => res as boolean);
    } else if (result instanceof Observable) {
      return result as Observable<boolean>; //
    }

    return result as boolean;
  }
}
