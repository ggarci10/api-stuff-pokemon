const router = require('express').Router();

const database = require('../db/index.js');


/**
 * @api {Middleware} 
 */
router.use((req, res, next) => {
    console.log('Running Router Level Middleware');

    const { headers, query } = req;

    next();
});

/**
 * @api {GET} /poke             
 * @apiExample localhost:8888/history or localhost:8888/history?searchterm=[pokemon name]
 */
router.get('/', async (req, res) => {
    try {

        const {  _parsedUrl } = req;
        const {  query } = _parsedUrl;

        let result = '';
        const optional = String(query).indexOf('=');

        if(optional === -1){
            result = await database.find('Results', null);
        } else {
            let info = query.split('=');
            result = await database.find('Results', info[1]);
        }

        res.json(result);

    } catch (error) {
        res.status(500).json(error.toString());
    }
});

module.exports = router;