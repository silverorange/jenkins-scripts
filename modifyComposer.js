const fs = require('fs');

// read
fs.readFile('composer.json', 'utf8', (err, contents) => {
  if (err) {
    console.log('File could not be read');
  } else {
    try {
      // parse
      const json = JSON.parse(contents);
      
      // query + modify
      if (json.name) {
        console.log(`package name is ${json.name}`);
      }
      json.name = 'Modified Name';
      
      // write
      const newContents = JSON.stringify(json, null, 2);
      fs.writeFile('composer.new.json', newContents, function(err) {
          if (err) {
              return console.log(err);
          }
          console.log('done');
      }); 
    } catch (e) {
      console.log(`There was a syntax error in the JSON file ${e.message}`);
    }
  }
});
