import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { Observable } from 'rxjs';
import { JwtUtility } from '../utility/jwt';

@Injectable()
export class LoggedInUser implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract the JWT from the Authorization header
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      // Verify and decode the JWT
      const payload = JwtUtility.verifyJwt(token)
     
      if(!payload){
        return false
      }
      // Store the payload in the request object for later use
      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
