export class ResponseDTO<T = any | any[]> {
  status?: boolean;
  statusCode?: number;
  message?: string;
  translateCode?: string;
  data?: T;
}
