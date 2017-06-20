document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('button').addEventListener('click', main);
});
function main() {

  var url = ''

  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      console.log(tabs[0].url);
      url = tabs[0].url;
      console.log(url);

      $('button').hide()
      $("#paper").css('padding', '15px');
      $("#content").append("<img id='image' src='loading.gif' alt='loading...'>")
      var data = {'url': url};

      $.ajax({
        url: 'http://thegist.herokuapp.com/api/summary',
        data: data,
        type: 'post',
        success: function(response){
          console.log(response);



          var key = response.id;

          var ajaxtime = setInterval(function(){



             $.ajax({
               url: 'http://thegist.herokuapp.com/api/_results/' + key,
               type: "GET",

               success: function(data, textStatus, xhr) {
                 if (xhr.status === 202){
                 console.log(data);

               } else {

                 console.log(typeof data);
                 $("#image").remove();

                 title = data.title;
                 summary = data.summary;

                 $('#content').append('<h3 class="title">' + title + '</h3> <br> <br>');
                 $('html').width(3 * $('#content').width());
                 $('#content').append('<p class="news">' + summary + '</p>');
                 $('html').height($('#content').width());
                 console.log(2 * $('#content').width());
                 clearInterval(ajaxtime);
               }
               },
               error: function(error){
                 console.log(error);
                 $("#image").remove();
                 $('#content').append('<p class="error-message">No possible to summarize this web page now! Sorry! Try again or other page!</p>');
                 clearInterval(ajaxtime);
               }
             })
            }, 1000);
          },
          error: function(error){
            console.log(error)
          }
          });
    });
}
