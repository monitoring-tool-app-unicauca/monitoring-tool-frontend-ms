export interface HealthCheckDto {
  id: number;
  responseTimeMs: number;
  status: string;
  checkedAt: Date;
}