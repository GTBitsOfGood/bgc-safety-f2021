import Cors from "cors";
// import urls from "../../utils/urls";

const cors = Cors({
  origin: true,
});

const useCors = (req, res) =>
  new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });

export default useCors;
