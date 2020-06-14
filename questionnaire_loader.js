//I was just seeing if a basic loader works right now 

const fs = require('fs')
fs.readFile('./Questionnaires/sample_questionnaire.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return
    }
    const json = JSON.parse(jsonString);
    //console.log(json);
    return json;
})

//pull it from a server though not really sure if this would work

// function loadFile(filePath) {
//     var result = null;
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.open("GET", filePath, false);
//     xmlhttp.send();
//     if (xmlhttp.status==200) {
//       result = xmlhttp.responseText;
//     }
//     return result;
//   }