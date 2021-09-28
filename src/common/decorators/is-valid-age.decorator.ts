import { registerDecorator, ValidationOptions } from 'class-validator'
import { subYears, isBefore, parseISO } from 'date-fns'

export function IsValidAge(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsValidAge',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const inputtedDate = parseISO(value)
          const currentDate = new Date()
          const minDate = subYears(currentDate, 16)
          return isBefore(inputtedDate, minDate)
        },
        defaultMessage() {
          return 'You need to have at least 16 years to be able to register in our platform.'
        }
      }
    })
  }
}
