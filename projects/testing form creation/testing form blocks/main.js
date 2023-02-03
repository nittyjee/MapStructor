async function button(){
  let [fileHandle] = await window.showOpenFilePicker();
//   console.log(fileHandle.kind);
let fileData = await fileHandle.getFile();
   console.log(fileData);
}