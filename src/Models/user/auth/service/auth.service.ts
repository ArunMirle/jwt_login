import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/Models/user/service/user.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validate the user during login
  async validateUser(username: string, password: string): Promise<any> {
    return this.usersService.validateUser(username, password);
  }

  // Create a JWT token for the user
  async login(user: any) {
    const payload = { username: user.username, sub: user._id }; // 'sub' is the user's ID
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: 'jwt_secret',  // This secret key should be the same for verification
        expiresIn: '1h',       // Token expiration time
      }),
    };
  }
}
