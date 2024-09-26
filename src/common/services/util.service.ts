import { Injectable, Logger } from '@nestjs/common';
import { ResponseDTO } from '../dtos/response.dto';

@Injectable()
export class UtilService {
  logger = new Logger(UtilService.name);

  getSuccessResponse(
    data: any,
    message?: string,
    translateCode?: string,
  ): ResponseDTO {
    return {
      status: true,
      data,
      message,
      translateCode,
    };
  }

  getErrorResponse(
    data: any,
    message: string,
    translateCode?: string,
  ): ResponseDTO {
    return {
      status: false,
      data,
      message,
      translateCode,
    };
  }
}