import Joi from 'joi';

const rgxPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!@#$%^&*])(?=.{8,})');

export const schemas = {
  auth: Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys({
      password: Joi.string().pattern(rgxPassword).required(),

      login: Joi.string().min(3).max(50).required(),
    }),

  user: Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys({
      name: Joi.string().min(3).max(50).required(),

      password: Joi.string().pattern(rgxPassword).required(),

      login: Joi.string().min(3).max(50).required(),
    }),

  board: Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys({
      title: Joi.string().min(1).max(200).required(),

      columns: Joi.array().items({
        title: Joi.string().min(1).max(100).required(),
        order: Joi.number().required(),
      }),
    }),

  task: Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys({
      title: Joi.string().min(1).max(100).required(),

      order: Joi.number().required(),

      description: Joi.string().min(1).max(1000).required(),

      columnId: Joi.string()
        .guid({ version: ['uuidv4', 'uuidv5'] })
        .allow(null),

      userId: Joi.string()
        .guid({ version: ['uuidv4', 'uuidv5'] })
        .allow(null),
    }),
};

export type KeyofSchemas = keyof typeof schemas;
