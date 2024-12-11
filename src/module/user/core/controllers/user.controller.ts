import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common'; // Importing Request correctly
import { UsersService } from '../service/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoggedInUser } from '../../common/guards/loggedInUser';
import { LoginDto } from '../dtos/login.dto';



@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, password, email, phoneNumber, age } = createUserDto;

    // Check if the username or email already exists
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      return { message: 'Username or email already exists' };
    }

    // Create the new user
    const newUser = await this.usersService.createUser(username, password, email, phoneNumber, age);
    return { message: 'User registered successfully', username: newUser.username };
  }

  @UseGuards(LoggedInUser)  // Protect this route with the JwtAuthGuard
  @Get('info')
  async getUserProfile(@Request() req: any) {
    const userId = req.user.userId;  // The userId is added to the request by JwtStrategy
    console.log(req.user);
    // Call the service to get the user details by userId, excluding password
    const user = await this.usersService.findById(userId);

    if (!user) {
      return { message: 'User not found' };  // Handle case where user doesn't exist
    }

    // Return user data excluding password
    return user ;
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.usersService.login(user);  // Return the JWT token
   }
}
