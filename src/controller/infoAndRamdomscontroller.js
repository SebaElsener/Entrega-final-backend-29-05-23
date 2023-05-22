
import { fork } from 'child_process'
import { infoLogger } from '../logger.js'
import { infoService } from '../business/infoBusiness.js'

const info = (req, res) => {
    const processInfo = infoService()
    if (process.env.INFOCONSOLE == 'ON') { infoLogger.info(processInfo) }
    res.render('info', { processInfo })
}

const randoms = (req, res) => {
    const randomNumbersFork = fork('./utils/randomNumbers.js')
    const numbersQty = req.query.cant || 500000
    randomNumbersFork.send(numbersQty)
    randomNumbersFork.on('message', (randomNumbersGenerated) => {
        res.render('random', { randomNumbersGenerated })
    })
}

export {
    info,
    randoms
}