import raw from '../src/constants/imiennicy.txt';
export const FileInJSON = () => fetch(raw)
  .then(r => r.text())
  .then(text => {
    var lines = text.split('\n');
    var header = [];
    header.add(lines[0].split(" ")[0].toString())
    header.add(lines[0].split(" ")[1])
    header.add(lines[0].split(" ")[2])
    var result = [];
    for(var line = 1; line < lines.length; line++){
        let newRowData  = JSON.parse(`{
            "${header[0]}" : ${line[i].split(" ")[0]},
            "${header[1]}" : ${line[i].split(" ")[1]},
            "${header[2]}" : ${line[i].split(" ")[2]},
        }`)
        result.add(newRowData)
      }
  });
