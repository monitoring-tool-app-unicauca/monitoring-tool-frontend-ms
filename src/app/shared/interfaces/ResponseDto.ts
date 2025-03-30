export class ResponseDto<T> {
  data?: T;
  status!: number;
  message!: string;
  errorCode?: string;

}
