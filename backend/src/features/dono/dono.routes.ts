import { type Express, Router } from 'express';
import { createValidator } from '@/shared/middleware/index.js';
import { DonoController } from './dono.controller.js';
import { DonoRepository } from './dono.repository.js';
import { createDonoSchema, donoParamsSchema, updateDonoSchema } from './dono.schemas.js';
import { DonoService } from './dono.service.js';

export function createDonoRouter(app: Express): void {
    const router = Router();

    const donoRepository = new DonoRepository();
    const donoService = new DonoService(donoRepository);
    const donoController = new DonoController(donoService);

    router.get('/', (req, res) => donoController.getAll(req, res));
    router.get('/:id', createValidator(donoParamsSchema, 'params'), (req, res) => donoController.getById(req, res));
    router.post('/', createValidator(createDonoSchema, 'body'), (req, res) => donoController.create(req, res));
    router.put(
        '/:id',
        createValidator(donoParamsSchema, 'params'),
        createValidator(updateDonoSchema, 'body'),
        (req, res) => donoController.update(req, res),
    );
    router.delete('/:id', createValidator(donoParamsSchema, 'params'), (req, res) => donoController.delete(req, res));

    app.use('/donos', router);
}
