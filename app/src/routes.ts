import { Request, Response, Router } from 'express';
import { object, string, guard } from 'decoders';

const initRoutes = (router: Router) => {
  const getDataHandler = (req: Request, res: Response) => {
    let id: string;
    try {
      ({ id } = guard(object({ id: string }))(req.params));
    } catch (err) {
      return res.status(400).send(err.message);
    }

    console.log('REQUEST', id);

    res.status(200).send(id);
  };

  router.get('/api/data/:id', getDataHandler);
};

export { initRoutes };
