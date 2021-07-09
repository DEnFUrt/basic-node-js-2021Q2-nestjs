import {
  PipeTransform,
  Injectable,
  /* ArgumentMetadata, */ BadRequestException,
} from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any /* , metadata: ArgumentMetadata */) {
    const { error } = this.schema.validate(value);

    if (error) {
      const message = JSON.stringify(
        (error as ValidationError).details.map((e) => {
          const { path, message: mess } = e;
          return { path, message: mess };
        }),
      );

      throw new BadRequestException(message);
    }

    return value;
  }
}
