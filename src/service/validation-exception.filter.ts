import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.BAD_REQUEST
    ) {
      const validationErrors = exception.getResponse() as ValidationError[];

      let errors: string[] = [];

      if (Array.isArray(validationErrors)) {
        errors = this.flattenValidationErrors(validationErrors);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (validationErrors instanceof ValidationError) {
          errors = this.flattenValidationErrors([validationErrors]);
        } else if (
          typeof validationErrors === 'object' &&
          validationErrors !== null
        ) {
          errors = Object.values(validationErrors).map((error) =>
            String(error),
          );
        }
      }

      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }

  private flattenValidationErrors(errors: ValidationError[]): string[] {
    return errors.reduce((acc, error) => {
      if (error.constraints) {
        acc.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        acc.push(...this.flattenValidationErrors(error.children));
      }
      return acc;
    }, [] as string[]);
  }
}
