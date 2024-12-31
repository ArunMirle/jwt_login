import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

import { JwtUtility } from '../utility/jwt';
import { LoggedInUser } from './loggedInUser';

jest.mock('../utility/jwt'); // Mock the JwtUtility to isolate tests

describe('LoggedInUser Guard', () => {
  let guard: LoggedInUser;

  beforeEach(() => {
    guard = new LoggedInUser();
  });

  const mockExecutionContext = (authHeader?: string) => {
    const request: any = { headers: { authorization: authHeader } };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  };

  it('should allow access when a valid JWT is provided', () => {
    const mockPayload = { userId: 1 }; // Mock payload
    const mockToken = 'valid.jwt.token';

    JwtUtility.verifyJwt = jest.fn().mockReturnValue(mockPayload);

    const context = mockExecutionContext(`Bearer ${mockToken}`);
    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(true);
    expect(JwtUtility.verifyJwt).toHaveBeenCalledWith(mockToken);

    const request = context.switchToHttp().getRequest();
    expect(request.user).toEqual(mockPayload); // Ensure user is set correctly
  });

  it('should throw UnauthorizedException when Authorization header is missing', () => {
    const context = mockExecutionContext();

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'Authorization header missing',
    );
  });

  it('should throw UnauthorizedException when token is missing', () => {
    const context = mockExecutionContext('Bearer ');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Token missing');
  });

  it('should throw UnauthorizedException for invalid or expired token', () => {
    const mockToken = 'invalid.jwt.token';
    JwtUtility.verifyJwt = jest.fn(() => {
      throw new Error('Invalid or expired token');
    });

    const context = mockExecutionContext(`Bearer ${mockToken}`);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'Invalid or expired token',
    );
    expect(JwtUtility.verifyJwt).toHaveBeenCalledWith(mockToken);
  });
});
