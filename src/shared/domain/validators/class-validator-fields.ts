import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface';
import { validateSync, ValidationError } from 'class-validator';

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = null;
  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length > 0) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }

      return false;
    }

    this.validatedData = data;
    return true;
  }

  static extractMessages(errors: ValidationError[]): string[] {
    return errors.flatMap(err => {
      const messages = Object.values(err.constraints || {});
      if (err.children && err.children.length > 0) {
        return [
          ...messages,
          ...ClassValidatorFields.extractMessages(err.children),
        ];
      }
      return messages;
    });
  }
}
