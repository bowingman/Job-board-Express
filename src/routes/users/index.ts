import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import authMiddleware from "src/middleware/auth.middleware";

import { findAllUser } from "src/services/dupuser-service";

const router = Router();

router.get(
  "/",
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  authMiddleware,
  async (_: Request, response: Response, next: NextFunction) => {
    try {
      const findAllUsersData = await findAllUser();

      response
        .status(200)
        .json({ data: findAllUsersData, message: "findAllUser" });
    } catch (error) {
      next(error);
    }
  }
);
// .post(bodyParser.json(), (request: Request, response: Response) => {
//   response.json(
//     createOne({ username: (request.body as Omit<User, "id">).username })
//   );
// });

// router.get('/:id', (request: Request, response: Response) => {
//   response.json(findOne(request.params.id));
// });

// router.delete('/:id', (request: Request, response: Response) => {
//   deleteOne(request.params.id);
//   response.sendStatus(204);
// });

export default router;
