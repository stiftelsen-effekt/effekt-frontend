module.exports = {
    api_url: "ENV.API_URL",

    request: function(endpoint, type, data, cb) {
        var http = new XMLHttpRequest();
        //TODO:      this context is properly binded
        var url = this.api_url + endpoint;

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200 ) {
                    var response = JSON.parse(this.responseText);

                    if (response.status == 200) {
                        cb(null, response);
                    }
                    else if (response.status == 400) {
                        cb(response.content, null);
                    }
                } else {
                    cb(this.status, null);
                }
            }
        };

        if (type == "POST") {
            http.open("POST", url, true);
            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            http.send("data=" + encodeURIComponent(JSON.stringify(data)));
        } 
        else if (type == "POST_JSON") {
            http.open("POST", url, true);
            http.setRequestHeader("Content-Type", "application/json");
            http.send(JSON.stringify(data));
        }
        else if (type == "GET") {
            http.open("GET", url, true);
            http.send(data);
        }
    }
}
