import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.schema';
import { JwtUtility } from '../../common/utility/jwt';
import { Action, Subject } from '../../common/types/permission';
import { UsersService } from './user.service';

jest.mock('bcrypt'); 
jest.mock('../../common/utility/jwt'); 

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  
  const userModelMock = {
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockUser = {
    _id: '123',
    username: 'testUser',
    password: 'hashedPassword',
    email: 'test@example.com',
    permissions: [
      { action: Action.CREATE, subject: Subject.USER },
      { action: Action.READ, subject: Subject.USER },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock, 
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne('testUser');
      expect(result).toEqual(mockUser);
      expect(userModel.findOne).toHaveBeenCalledWith({ username: 'testUser' });
    });

    it('should return undefined if user not found', async () => {
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.findOne('nonexistentUser');
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a user without the password', async () => {
      const userDocumentMock = {
        ...mockUser,
        toObject: jest.fn().mockReturnValue({ ...mockUser }),
      };
  
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userDocumentMock),
      });
  
      const result = await service.findById('123');
      expect(result).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith('123');
    });
  
    it('should return null if user not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
  
      const result = await service.findById('nonexistentId');
      expect(result).toBeNull();
    });
  });
  

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const password = 'plainPassword';
      const hashedPassword = 'hashedPassword';
  
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
  
      const newUserInput = {
        username: 'newUser',
        password,
        email: 'new@example.com',
        phoneNumber: '1234567890',
        age: 25,
      };
  
      const savedUser = { ...newUserInput, password: hashedPassword, _id: 'newId' };
      userModelMock.create.mockResolvedValue(savedUser);
  
      const result = await service.createUser(
        newUserInput.username,
        newUserInput.password,
        newUserInput.email,
        newUserInput.phoneNumber,
        
      );
  
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userModelMock.create).toHaveBeenCalledWith({
        ...newUserInput,
        password: hashedPassword,
        permissions: [
          { action: Action.CREATE, subject: Subject.USER },
          { action: Action.READ, subject: Subject.USER },
        ],
      });
      expect(result).toEqual(savedUser);
    });
  });
  

  describe('validateUser', () => {
    it('should return the user if password is valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.validateUser('testUser', 'correctPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should return null if password is invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.validateUser('testUser', 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const payload = { username: mockUser.username, userId: mockUser._id };
      JwtUtility.generateJwt = jest.fn().mockReturnValue('accessToken123');

      const result = await service.login(mockUser);

      expect(JwtUtility.generateJwt).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ accessToken: 'accessToken123' });
    });
  });
});
