import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../service/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { UsersController } from './user.controller';


const mockUsersService = {
  findOne: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
  validateUser: jest.fn(),
  login: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: typeof mockUsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        age: 25,
      };

      usersService.findOne.mockResolvedValue(null); 
      usersService.createUser.mockResolvedValue({ username: 'testUser' });

      const result = await usersController.register(createUserDto);
      expect(usersService.findOne).toHaveBeenCalledWith('testUser');
      expect(usersService.createUser).toHaveBeenCalledWith(
        createUserDto.username,
        expect.any(String), 
        createUserDto.email,
        createUserDto.phoneNumber,
        createUserDto.age,
      );
      expect(result).toEqual({
        message: 'User registered successfully',
        username: 'testUser',
      });
    });

    it('should return an error if username exists', async () => {
      usersService.findOne.mockResolvedValue({ username: 'testUser' });

      const createUserDto: CreateUserDto = {
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        age: 25,
      };

      const result = await usersController.register(createUserDto);
      expect(result).toEqual({ message: 'Username or email already exists' });
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const mockRequest = { user: { userId: '12345' } };
      usersService.findById.mockResolvedValue({ username: 'testUser' });

      const result = await usersController.getUserProfile(mockRequest);
      expect(usersService.findById).toHaveBeenCalledWith('12345');
      expect(result).toEqual({ username: 'testUser' });
    });

    it('should return error if user not found', async () => {
      const mockRequest = { user: { userId: '12345' } };
      usersService.findById.mockResolvedValue(null);

      const result = await usersController.getUserProfile(mockRequest);
      expect(result).toEqual({ message: 'User not found' });
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const loginDto: LoginDto = {
        username: 'testUser',
        password: 'password123',
      };
      usersService.validateUser.mockResolvedValue({ username: 'testUser', _id: '12345' });
      usersService.login.mockResolvedValue({ accessToken: 'test-token' });

      const result = await usersController.login(loginDto);
      expect(usersService.validateUser).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(usersService.login).toHaveBeenCalledWith({ username: 'testUser', _id: '12345' });
      expect(result).toEqual({ accessToken: 'test-token' });
    });

    it('should return an error for invalid credentials', async () => {
      usersService.validateUser.mockResolvedValue(null);
      const loginDto: LoginDto = {
        username: 'invalidUser',
        password: 'wrongPassword',
      };

      const result = await usersController.login(loginDto);
      expect(result).toEqual({ message: 'Invalid credentials' });
    });
  });
});
