import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateUserDto();
    dto.username = 'testuser';
    dto.password = 'testpassword';
    dto.email = 'test@example.com';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail if username is empty', async () => {
    const dto = new CreateUserDto();
    dto.username = '';
    dto.password = 'testpassword';
    dto.email = 'test@example.com';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
  });
});
