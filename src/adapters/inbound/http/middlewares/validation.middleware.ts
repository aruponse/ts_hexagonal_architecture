import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(dtoClass, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        );
        
        res.status(400).json({
          error: 'Validation failed',
          details: errorMessages,
        });
        return;
      }

      req.body = dto;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid request data' });
    }
  };
};