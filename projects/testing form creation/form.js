

function save_func(){
   

    var  name = document.getElementById("name").value;
    var  source_name = document.getElementById("source_name").value;
    var  type = document.getElementById('type').value;
    var  database = document.getElementById('database').value;
    var  group = document.getElementById('group').value;
     var  slider = document.getElementById('check-aaa5').value;
    // var  name = document.getElementById('name').value;
    var data =[];
    data.push(name, source_name, type, database, group, slider);
    alert(data);

    var data_string = JSON.stringify(data);

    var file = new Blob([data_string], {type : "text"});

    var anchor = document.createElement('a');

    anchor.href = URL.createObjectURL(file)

    anchor.download = "data.txt";

    anchor.click();


    
    alert(name +" "+source_name);
}
