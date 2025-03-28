import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

function validateData(schema, validateFromParams = false) {
  return (req, res, next) => {
    try {
      if (validateFromParams) {
        const result = schema.parse(req.params);
        req.params = result;
      } else {
        const result = schema.safeParse(req.body);
        if (!result.success) {
          throw result.error;
        }
        req.body = result.data;
      }
      next();
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
        }));
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please fill in all fields",
          details: errorMessages,
        });
      } else {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal Server Error" });
      }
    }
  };
}

export default validateData;
