import { Request, Response, Router } from 'express';
import { object, string, guard } from 'decoders';
import { DataService, DataRow } from './data-service';

type Services = {
  dataService: DataService
}

const initRoutes = (router: Router, services: Services) => {
  const { dataService } = services;
  const getDataRowHandler = async (req: Request, res: Response) => {
    let id: string;
    try {
      ({ id } = guard(object({ id: string }))(req.params));
    } catch (err) {
      return res.status(400).send(err.message);
    }

    try {
      const dataRow: DataRow | undefined = await dataService.getDataRow(id);
      if (!dataRow) { return res.status(422).send(); }
      res.status(200).send(dataRow);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  const getDataRowsHandler = async (req: Request, res: Response) => {
    try {
      const dataRows: DataRow[] = await dataService.getDataRows();
      res.status(200).send(dataRows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  const createDataRowHandler = async (req: Request, res: Response) => {
    let content: string;
    try {
      ({ content } = guard(object({ content: string }))(req.body));
    } catch (err) {
      return res.status(400).send(err.message);
    }
    try {
      const dataRow: DataRow = await dataService.createDataRow(content);
      res.status(200).send(dataRow);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  router.get('/api/data/:id', getDataRowHandler);
  router.get('/api/data', getDataRowsHandler);
  router.post('/api/data', createDataRowHandler);
};

export { initRoutes };
