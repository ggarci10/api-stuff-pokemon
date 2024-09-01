const router = require('express').Router();

const database = require('../db/index.js');
const pokestuff = require('poke-app-api');


/**
 * @api {Middleware} 
 */
router.use((req, res, next) => {
    console.log('Running Router Level Middleware');

    const { headers, query } = req;

    query.metadata = {
        lastSearched: new Date()
    };

    next();
});

/**
 * @api {GET} /search            
 * @apiExample localhost:8888/search?searchTerm=[pokemon name]
 */
router.get('/', async (req, res) => {
    try {

        const {  _parsedUrl } = req;
        const {  query } = _parsedUrl;

        let info = query.split('=');
   
        let abilityList = [];
        const pokemoninfo = await pokestuff.findpoke(info[1]);
        for (let i = 0; i < pokemoninfo.abilities.length; i++) {
            abilityList.push(pokemoninfo.abilities[i].ability.name);
        }; 

        let id = {
            id: abilityList,
        };

        let results = {
            searchTerm: info[1],
            result: id,
        };
         
        res.json(results);

        results = {
            searchTerm: info[1],
            searchCount: abilityList.length,
            lastSearched: new Date(),
        };
        
        database.save('Results', { ...results });

    } catch (error) {
        res.status(500).json(error.toString());
    }
});

/**
 * @api {GET} /search/[ability]/details       
 * @apiExample localhost:8888/search/[ability]/details?searchterm=[pokemon name]
 */
router.get('/:name/details', async (req, res) => {
    try {
        const {  _parsedUrl } = req;
        const { href  } = _parsedUrl;
        
        const searchTerm = href.split('=');

        let abi = searchTerm[0].split('/');

        const original = await database.find('Results', searchTerm[1]);

        const pokemoninformation = await pokestuff.findability(abi[1]);
        let selections = {
            id:abi[1], 
            display:pokemoninformation.effect_entries[1].effect,
        };

        const results = {
            searchTerm: searchTerm[1],
            selections,
        };        

        res.json(results);

        database.update('Results', original, {
            id:abi[1], 
            display:pokemoninformation.effect_entries[1].effect,
        });
        
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

module.exports = router;