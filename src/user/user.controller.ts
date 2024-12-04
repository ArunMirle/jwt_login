import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common'; // Importing Request correctly
import { UsersService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, password, email, phoneNumber, age } = createUserDto;

    // Check if the username or email already exists
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      return { message: 'Username or email already exists' };
    }

    // Create the new user
    const newUser = await this.usersService.createUser(username, password, email, phoneNumber, age);
    return { message: 'User registered successfully', userId: newUser._id };
  }

  @UseGuards(JwtAuthGuard)  // Protect this route with the JwtAuthGuard
  @Get('profile')
  async getUserProfile(@Request() req: any) {
    const userId = req.user.userId;  // The userId is added to the request by JwtStrategy

    // Call the service to get the user details by userId, excluding password
    const user = await this.usersService.findById(userId);

    if (!user) {
      return { message: 'User not found' };  // Handle case where user doesn't exist
    }

    // Return user data excluding password
    return user ;
  }
}
