function getInfo(artist, callback) {
  $.ajax({
          type : 'POST',
          url : 'https://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.getInfo&' +
                 'artist=' + artist + '&' +
                 'api_key=ee45ef94fff5729caec4b77319d3b316&' +
                 'format=json',
          dataType : 'jsonp',
          success : function(data) { callback(data); },
          error : function(code, message){
              $('#error').html('Error Code: ' + code + ', Error Message: ' + message);
          }
      });
}

function getSimilar(artist, callback) {
  $.ajax({
          type : 'POST',
          url : 'https://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.getSimilar&' +
                 'artist=' + artist + '&' +
                 'limit=20&' +
                 'api_key=ee45ef94fff5729caec4b77319d3b316&' +
                 'format=json',
          dataType : 'jsonp',
          success : function(data) { callback(data); },
          error : function(code, message){
              $('#error').html('Error Code: ' + code + ', Error Message: ' + message);
          }
      });
}

function plotArtist(element, index) {
  d3.select("#cloud")
    .append("p")
    .html(element.name)
    .on("click", function() {
      getSimilar(element.name, function(data) {
        d3.select("#cloud").html("");
        
        data.similarartists.artist.forEach(plotArtist)
      })
      console.log(element.name); })
}

getInfo("The+Beatles", function(data) {
  $('#artistInfo').html(
    data.artist.name +
    " | " +
    data.artist.bio.summary.split("").splice(0, 40).join("") +
    " ..."
  );
});

getSimilar("The+Beatles", function(data) {
  d3.select("#cloud").html("");
  data.similarartists.artist.forEach(plotArtist)
});
