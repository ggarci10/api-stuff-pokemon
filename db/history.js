const fs = require('fs');

const addHistory = (pokemon, isAbility) => {
    
    // creating and checking for history.json
    let file = '';
    try {
        file = fs.readFileSync('./history.json','utf-8');
    } catch {
        fs.writeFileSync('./history.json', '', 'utf-8');
        file = fs.readFileSync('./history.json','utf-8');
    };
    
    // creating the timeline
    let timeline = [];
    
    // checking to see if we have previous history if so add it to the timeline
    if(file.length !== 0){
        timeline = JSON.parse(file);
    }
    
    // we are required to get the results count for a search this line will get the sum of our results
    let resultCount = 1;
    if(!isAbility){
        resultCount = Object.keys(pokemon).length;
    };

    // creating the JSON object
    const history = {
        search: pokemon,
        resultCount,
    };
    

    // adding the object to the timeline
    timeline.push(history);

    // writing to the JSON history file
    file = JSON.stringify(timeline);
    fs.writeFileSync('./history.json', file, 'utf-8');

};

module.exports = {
    addHistory
};