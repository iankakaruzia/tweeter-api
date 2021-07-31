import * as Joi from 'joi'

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(8080),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().required(),
  CLIENT_RESET_PASSWORD_URL: Joi.string().required(),
  CLIENT_CONFIRMATION_URL: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  BULL_UI_USERNAME: Joi.string().required(),
  BULL_UI_PASSWORD: Joi.string().required(),
  SENTRY_DNS: Joi.string().required(),
  SENTRY_TRACES_SAMPLE_RATE: Joi.number().required()
})
