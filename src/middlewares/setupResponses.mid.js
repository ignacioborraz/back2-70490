const setupResponses = (req, res, next) => {
  try {
    const { method, originalUrl: url } = req;
    const messages = {
      200: "Success",
      201: "Created",
      400: "Client Error",
      401: "Bad auth",
      403: "Forbidden",
      404: "Not found",
      500: "Server Error",
    };
    const successResponse = (code, response, message = messages[code]) =>
      res.status(code).json({ method, url, response, message });
    const errorResponse = (code, err = messages[code]) => {
      const error = new Error(err);
      error.statusCode = code;
      throw error;
    };
    res.json200 = (resp, mesg) => successResponse(200, resp, mesg);
    res.json201 = (resp, mesg) => successResponse(201, resp, mesg);
    res.json400 = (err) => errorResponse(400, err);
    res.json401 = () => errorResponse(401);
    res.json403 = () => errorResponse(403);
    res.json404 = () => errorResponse(404);
    res.json500 = () => errorResponse(500);
    next();
  } catch (error) {
    next(error);
  }
};

export default setupResponses;
