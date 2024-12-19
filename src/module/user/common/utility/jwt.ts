import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
export class JwtUtility {
    public static generateJwt(payload: object | string | Buffer) {
        const key = process.env.JWT_SECRET;
        return sign(payload, key, { expiresIn: 360000 });
    }

    public static verifyJwt(token: string) {
        const key = process.env.JWT_SECRET;
        try {
            return verify(token, key);
        } catch (error) {
            return false;
        }
    }
}
