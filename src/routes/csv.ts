import { Router } from 'express';

import { readCsv } from '../controllers/csv';

const router = Router();

router.post('/', readCsv);

export default router;
