import { Controller, Post, Body, UseGuards, Get, Request, UseInterceptors } from '@nestjs/common'; // Importing Request correctly
import { UsersService } from '../service/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoggedInUser } from '../../common/guards/loggedInUser';
import { LoginDto } from '../dtos/login.dto';
import { SanitizeUserInterceptor } from '../../common/interceptors/hidePass.interceptor';



@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, password, email, phoneNumber, age } = createUserDto;

    
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      return { message: 'Username or email already exists' };
    }

    // Create the new user
    const newUser = await this.usersService.createUser(username, password, email, phoneNumber, age);
    return { message: 'User registered successfully', username: newUser.username };
  }

  
  @UseInterceptors(SanitizeUserInterceptor) 
  @Get('info')
  async getUserProfile(@Request() req: any) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    if (!user) {
      return { message: 'User not found' };
    }

    return user;
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
    return this.usersService.login(user);  
   }
}
