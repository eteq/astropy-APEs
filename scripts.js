function loadAPEs() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 1) {
        document.getElementById("apetoc").innerHTML = "Loading APE list...";
    } else if (this.readyState == 4) {
        if (this.status == 200) {
            populateToc(document.getElementById("apetoc"), JSON.parse(this.response));
        } else {
            console.log(this);
            document.getElementById("apetoc").innerHTML = "Failed to load the APE list from Github. Status Code: " + this.status;
        }
    }
  };
  xhttp.open("GET", "https://api.github.com/repos/astropy/astropy-APEs/contents", true);
  xhttp.send();
}

function populateToc(div, responsejson) {
    var apere = /APE(\d+)\.(rst|md)$/

    var entry, reres, path, apenum, title;

    div.innerHTML = '';

    for (i = 0; i < responsejson.length; i++) {
        entry = responsejson[i];
        reres = apere.exec(entry['name']);
        if (reres) {
            path = entry['path'];
            apenum = reres[1];

            var contentreq = new XMLHttpRequest();
            contentreq.open('GET', entry['download_url'], false);  // synchronous
            contentreq.send(null);

            if (contentreq.status === 200) {
                var lines = contentreq.responseText.split('\n');
                title = lines[0]
                div.innerHTML = div.innerHTML + '<br>' + '<a href="'+path+'"> APE ' + apenum + ': ' + title + '</a>';

            } else {
                console.log(contentreq);
                div.innerHTML = "Failed to load " + entry['name'] + " from Github. Status Code: " + contentreq.status;
            }
        }
    }

}

window.onload = loadAPEs;