import { type Express, Router } from 'express';
import { createValidator } from '@/shared/middleware/index.js';
import { CanilController } from './canil.controller.js';
import { CanilRepository } from './canil.repository.js';
import { CanilService } from './canil.service.js';
import { createCanilSchema, canilParamsSchema, updateCanilSchema } from './canil.schemas.js';

export function createCanilRouter(app: Express): void {
    const router = Router();

    const canilRepository = new CanilRepository();
    const canilService = new CanilService(canilRepository);
    const canilController = new CanilController(canilService);

    router.get('/', (req, res) => canilController.getAll(req, res));
    router.get('/:id', createValidator(canilParamsSchema, 'params'), (req, res) => canilController.getById(req, res));
    router.post('/', createValidator(createCanilSchema, 'body'), (req, res) => canilController.create(req, res));
    router.put(
        '/:id',
        createValidator(canilParamsSchema, 'params'),
        createValidator(updateCanilSchema, 'body'),
        (req, res) => canilController.update(req, res),
    );
    router.delete('/:id', createValidator(canilParamsSchema, 'params'), (req, res) => canilController.delete(req, res));

    app.use('/canils', router);
}
