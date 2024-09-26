import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UtilService } from 'src/common/services/util.service';
import { User } from './entity/user.entity';
import TokenVerificationPayload from '../auth/interface/token.verification.interface';

import { PickedUserDto, UserDTO } from './dto/user.dto';
import { ResponseDTO } from 'src/common/dtos/response.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { EBcrypt } from 'src/common/enums/bcrypt.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private utilService: UtilService,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const verifyJwt = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.findOneByEmail(verifyJwt?.email);

      return this.utilService.getSuccessResponse(
        user,
        'RESPONSE_TOKEN_VERIFIED',
      );
    } catch (error) {
      return this.utilService.getErrorResponse(null, 'RESPONSE_TOKEN_EXPIRED');
    }
  }

  async register(userDto: UserDTO | PickedUserDto): Promise<any> {
    try {
      const user = await this.userRepository.save({
        ...userDto,
      });
      return user;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async update(
    authUser: TokenVerificationPayload,
    updateUserDTO: UpdateUserDTO,
  ): Promise<ResponseDTO> {
    try {
      updateUserDTO['password'] = await bcrypt.hash(
        updateUserDTO['password'],
        EBcrypt.SALT_OR_ROUND,
      );;
      await this.userRepository.update(
        { id: authUser.id },
        { ...updateUserDTO, updated_by: authUser.id, },
      );
      const user = await this.userRepository.findOne({
        where: {
          id: authUser.id,
        },
      });
      delete user.password;
      delete user.refresh_token;
      return this.utilService.getSuccessResponse(user, 'RESPONSE_USER_UPDATED');
    } catch (error) {
      throw new HttpException(
        this.utilService.getErrorResponse(null, 'RESPONSE_USER_UPDATE_ERROR'),
        error?.status ?? HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async updateRefreshToken(
    email: string,
    token: string,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(
      { email },
      {
        refresh_token: token || null,
      },
    );
  }
}
