var companies = [];

function show_map() {
    var t = document.getElementById('technology')
    var technology = t.options[t.selectedIndex].value;
    //console.log(technology);
    var xcenter = {lat: 32.1665615, lng: 34.81151369999998};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: xcenter
    });

    for (var i=0; i < companies.length; i++) {
        for (var j=0; j < companies[i]['offices'].length; j++) {
            //console.log(companies[i]['offices'][j]);
            if (! companies[i]['offices'][j]['coordinates']) {
                continue;
            }

            if (technology) {
                if (! companies[i]['technologies']) {
                    continue;
                }
                var hits = companies[i]['technologies'].filter(function(v) {
                    return technology == v
                })
                if (hits.length == 0) {
                    continue;
                }
            }

            //console.log(companies[i]['offices'][j]);
            var marker = new google.maps.Marker({
                position: companies[i]['offices'][j]['coordinates'],
                title: companies[i]['name'],
                map: map
            });
        }
    }
}

function initMap() {
    document.getElementById('show').addEventListener('click', show_map);

    ajax_get('/data/technologies.json', function(data) {
       //technologies = data;
       var html = "<option></option>";
       for (var i=0; i < data.length; i++) {
           html += "<option>" + data[i] + "</option>";
       }
       document.getElementById('technology').innerHTML = html;
    });

   ajax_get('/data/companies.json', function(data) {
       //console.log(data);
       companies = data;
       show_map();
    });
}

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                //console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

