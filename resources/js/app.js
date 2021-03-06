require('chart.js');
require('./bootstrap');

$(document).ready(function(){
    console.log("js collegato");
      // questo if gestisce il modo in cui ci ricaviamo le coordiante dato un indirizzo.
      //Nel caso in cui l'utente commetta errori e dunque la pagina si ricarichi (non perdendo i valori grazie a old()) l'ajax viene richiamato in automatico su quei valori.
      if ($("input[name=address]").val()) {
        var input = $("input[name=address]").val();
        $.ajax({
            url : "https://api.tomtom.com/search/2/geocode/"+input+".json?",
            data: {
              "key": "GqqMbjtoswnKOW5HbgKmS6sLaqEXL7pl",
            },
            method : "GET",
            success : function (data) {
              var lat = data["results"][0]["position"]["lat"];
              var lon = data["results"][0]["position"]["lon"];
              var position = data["results"][0]["position"];
              $("input[name=lat]").val(position["lat"]);
              $("input[name=lon]").val(position["lon"]);
              $("#bottoneCreate").prop("disabled", false);
            },
            error : function (richiesta,stato,errori) {
              console.log("E' avvenuto un errore. " + errori, "stato " + stato, richiesta);
            }
      });
      }

      // Nel caso in cui l'indirizzo non sia stato ancora inserito allora si attende che l'utente abbia finito di scriverlo e quando il focus esce dall'input viene richiamato l'ajax che ottiene le coordinate.
      $(".info").on("blur", "input[name=address]", function(){
          var input = $("input[name=address]").val();
          console.log("funziona o no");
          $.ajax({
              url : "https://api.tomtom.com/search/2/geocode/"+input+".json?",
              data: {
                "key": "GqqMbjtoswnKOW5HbgKmS6sLaqEXL7pl",
              },
              method : "GET",
              success : function (data) {
                //rimuovo eventuali p che mostra l'errore
                $(".address p").remove();
                // controllo di riceve almeno un indirizzo valido, se non lo ricevo faccio append di un p che mostra un messaggio d'errore
                // e disattiva il bottone d'invio dati
                // altrimneti valorizzo i campi lat e lon come sopra
                // e attivo il bottone d'invio dati
                if (data["results"].length === 0){
                  $("#bottoneCreate").prop("disabled", true);
                  $(".address").append("<p style='color: red'>Indirizzo non riconosciuto</p>")
                } else {
                  var lat = data["results"][0]["position"]["lat"];
                  var lon = data["results"][0]["position"]["lon"];
                  var position = data["results"][0]["position"];
                  $("input[name=lat]").val(position["lat"]);
                  $("input[name=lon]").val(position["lon"]);
                  $("#bottoneCreate").prop("disabled", false);
                }

              },
              error : function (richiesta,stato,errori) {
                console.log("E' avvenuto un errore. " + errori, "stato " + stato, richiesta);
              }
        });
      })

      // TEST PER DISABILITARE IL BOTTONE APPENA VIENE LICCATO PER EVITARE IL SALVATAGGIO DI DUPLICATI DI APPARTAMENTI
      // Se il bottone è attivo, appena ci clicco sopra si disattiva (evito doppio click)
      // if ($("#bottoneCreate").prop("disabled", false)) {
      //   $(".info").on("dblclick", "#bottoneCreate", function(){
      //     $("#bottoneCreate").prop("disabled", true);
      //   });
      // }

      // TEST PER ORDINARE CRONOLOGICAMENTE I MESSAGGI
      // $('.messages .card').sort(function(a,b) {
      //     console.log("ciclo");
      //    return $(a).data('time') > $(b).data('time');
      // }).appendTo('.messages');



      // GUIDA TOM TOM https://developer.tomtom.com/maps-sdk-web-js/tutorials-use-cases/map-marker-tutorial
      if($('#map').length){ // se esiste nella pagina il div con id "map"
        var currentApartment = [$("#longitude").val(), $("#latitude").val()];
        var map = tt.map({
                  container: 'map',
                  key: 'GqqMbjtoswnKOW5HbgKmS6sLaqEXL7pl',
                  style: 'tomtom://vector/1/basic-main',
                  center: currentApartment,
                  zoom: 18
              });
        var marker = new tt.Marker().setLngLat(currentApartment).addTo(map);
        var popupOffsets = {
          top: [0, 0],
          bottom: [0, -70],
          'bottom-right': [0, -70],
          'bottom-left': [0, -70],
          left: [25, -35],
          right: [-25, -35]
        }

        var popup = new tt.Popup({offset: popupOffsets}).setHTML("<p>" + $(".info #title").text() + "</p>" + $(".address p").text());
        marker.setPopup(popup).togglePopup();
      }


      var mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno','Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
      // STATISTICHE MESSAGGI
      var everyApartmentMessages = statistics.messages;
      console.log("tutti i messaggi:", everyApartmentMessages);
      // for (var variable in everyApartmentMessages) {
      //   console.log("il primo messaggio:", variable);
      // }
      // for (variabile of everyApartmentMessages) {
      //   console.log("il primo messaggio:", variable);
      // }

      // for (var i = 0; i < everyApartmentMessages.length; i++) {
      //   console.log("tutti i messaggi:", everyApartmentMessages[i]);
      // }
      console.log("statistics", statistics.messages);
      if ($('#charts').length) {
        var ctx = $('#viewsStats');
        var visualizzazioni = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: mesi,
                datasets: [{
                    label: '# messaggi ricevuti',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                      'rgba(150, 33, 146, 0.2)',
                      'rgba(82, 40, 204, 0.2)',
                      'rgba(4, 51, 255, 0.2)',
                      'rgba(0, 146, 146, 0.2)',
                      'rgba(0, 249, 0, 0.2)',
                      'rgba(202, 250, 0, 0.2)',
                      'rgba(255, 251, 0, 0.2)',
                      'rgba(255, 199, 0, 0.2)',
                      'rgba(255, 147, 0, 0.2)',
                      'rgba(255, 80, 0, 0.2)',
                      'rgba(255, 38, 0, 0.2)',
                      'rgba(216, 34, 83, 0.2)'
                    ],
                    borderColor: [
                        'rgba(150, 33, 146, 1)',
                        'rgba(82, 40, 204, 1)',
                        'rgba(4, 51, 255, 1)',
                        'rgba(0, 146, 146, 1)',
                        'rgba(0, 249, 0, 1)',
                        'rgba(202, 250, 0, 1)',
                        'rgba(255, 251, 0, 1)',
                        'rgba(255, 199, 0, 1)',
                        'rgba(255, 147, 0, 1)',
                        'rgba(255, 80, 0, 1)',
                        'rgba(255, 38, 0, 1)',
                        'rgba(216, 34, 83, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        // VISUALIZZAZIONI
        var ctm = $('#messagesStats');
        var messaggiRicevuti = new Chart(ctm, {
            type: 'line',
            data: {
                labels: mesi,
                datasets: [{
                    label: '# visualizzazioni',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                      'rgba(150, 33, 146, 0.2)',
                      'rgba(82, 40, 204, 0.2)',
                      'rgba(4, 51, 255, 0.2)',
                      'rgba(0, 146, 146, 0.2)',
                      'rgba(0, 249, 0, 0.2)',
                      'rgba(202, 250, 0, 0.2)',
                      'rgba(255, 251, 0, 0.2)',
                      'rgba(255, 199, 0, 0.2)',
                      'rgba(255, 147, 0, 0.2)',
                      'rgba(255, 80, 0, 0.2)',
                      'rgba(255, 38, 0, 0.2)',
                      'rgba(216, 34, 83, 0.2)'
                    ],
                    borderColor: [
                        'rgba(150, 33, 146, 1)',
                        'rgba(82, 40, 204, 1)',
                        'rgba(4, 51, 255, 1)',
                        'rgba(0, 146, 146, 1)',
                        'rgba(0, 249, 0, 1)',
                        'rgba(202, 250, 0, 1)',
                        'rgba(255, 251, 0, 1)',
                        'rgba(255, 199, 0, 1)',
                        'rgba(255, 147, 0, 1)',
                        'rgba(255, 80, 0, 1)',
                        'rgba(255, 38, 0, 1)',
                        'rgba(216, 34, 83, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
      }

      console.log(statistics.views);

      // console.log(statistics.messages);
});
