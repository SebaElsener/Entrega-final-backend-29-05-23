
import { errorLogger } from "../logger.js"

const routeError = (req, res, next) => {
    if (res.status = '404') {
        errorLogger.warn(`ruta '${req.path}' metodo '${req.method}' no implementada`)
    }
    next()
}

export default routeError