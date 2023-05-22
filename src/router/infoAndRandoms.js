
import { Router } from 'express'
import { info, randoms } from '../controller/infoAndRamdomscontroller.js'

const infoAndRandoms = new Router()

infoAndRandoms.get('/info', info)

infoAndRandoms.get('/randoms', randoms)

export default infoAndRandoms