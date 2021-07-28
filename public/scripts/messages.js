
$(document).ready(() => {

  const createConversationElement = function(dataInput) {
    const { id, item_id, user_id, vendor_id, message, is_vendor, name } = dataInput;
    const $article = $("<article class=\"conversation-article\">");
    const escape = function(str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
  
    const html = `
      <div class="message-page">
        <header class="sidebar">
          <p>Conversation with: ${name} about ${item}</p>
        </header>

        <div class="convos">
          <p>${escape(content.message)}</p>
          <form class="send-message" action="/messages/userID" method="POST">
            <input type="text" name="vendor_id" placeholder="reply..." required>
            <button type="submit">Send</button>
          </form>
        </div>
        
      </div>
      `;
    return $article.html(html);
  };


  const renderTweets = function(arrayOfTweetObjects) {
    arrayOfTweetObjects.forEach(tweetObject => {
      const $tweet = createTweetElement(tweetObject);
      $('#tweets-container').prepend($tweet);
    });
  };


  const loadTweets = function() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        renderTweets(tweets);
      });
  };

  loadTweets();


  const loadLastTweet = function() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        const lastTweet = tweets.length - 1;
        renderTweets([tweets[lastTweet]]);
      });
  };


  // AJAX POST request that sends the form data to the server.
  $("#create-tweet").submit(function(event) {
    event.preventDefault();
    $('#tweet-error').html("");

    const tweetText = $(event.target).serialize();

    if (tweetText === "text=") {
      $('#tweet-error').html("Surely you have something to say");

    } else if (tweetText.length > 140) {
      $('#tweet-error').html("Respect the limitations please");

    } else {
      $.post('/tweets', tweetText);

      $.ajax('/tweets', { method: 'GET' })
        .then(loadLastTweet());

      $('#tweet-text').val("");
      
      $('.counter').html(140);

    }
    
  });

});
