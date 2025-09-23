import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const role = (req.headers['x-role'] || '').toString();
    if (req.path === '/health') return true;
    const allowed = ['customer','merchant','admin'];
    return allowed.includes(role);
  }
}
