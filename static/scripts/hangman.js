var NONE=0;
var HEAD = 1;
var BODY = 2;
var LEFT_HAND = 3;
var RIGHT_HAND = 4;
var LEFT_LEG = 5;
var RIGHT_LEG = 6;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var deadStatus;
var gameStatus;

var main = function() {
  prepareNewGame();
  //game_timer.runTimer();
}

$(document).bind("keyup",function(e){
    var value = String.fromCharCode(e.keyCode);
    if(65 <= e.keyCode && e.keyCode <=90)
    {
      checkAlpha($('#'+value));
    }
});

function prepareNewGame()
{
  $('#hangman').attr('src','static/images/0.png');
  deadStatus = NONE;
  gameStatus = word.length;
  $('#deadman').show();
  $('#status').text('Go Blue!!!');
  $('#gamearea').show();
  populateBlanks();
  populateAlphabets();
  $('#hint').text(hint);
}

function populateAlphabets()
{
  var alphaContainer = $('#alpha-container');
  alphaContainer.empty();
  for (var i=0; i<alphabet.length; i++)
  {
    var alpha = createAlphabet(alphabet[i]);
    alphaContainer.append(alpha);
    alphaContainer.append('&nbsp;');
    if(i == 6 || i == 13 || i== 20){
      alphaContainer.append('<br><br><br>');
    }
  }
  alphaContainer.show();
}

function createAlphabet(alphabet)
{
  var element = $('<a>');
  element.text(alphabet);
  element.addClass('alphabet');
  element.attr('href','#');
  element.attr('id',alphabet);
  element.attr('onclick','checkAlpha(this)');
  return element;
}

function checkAlpha(alphabet){

  //check if link is disabled. If yes, exit the function
  if($(alphabet).hasClass('disabled'))
  {
    return;
  }

  //disable link
  $(alphabet).addClass("disabled");

  //link is not disabled. Check if the alphabet is present in the word.
  var letter = $(alphabet).text();

  var index = word.indexOf(letter);

  var found = 0;
  if(index == -1)
  {
    return hangman();
  }

  while (index != -1)
  {
    //word contains the letter. Change the innerHTML of the blank to letter.
    $('#blank'+index).text(letter);

    //set next index to the next alphabet.
    index = word.indexOf(letter, index + 1);

    found++;
  }

  updateProgress(found);
}

function updateProgress(found)
{
  gameStatus = gameStatus - found;
  if(gameStatus == 0)
  {
    //game won code;
    gameWon();
  }
}

function gameWon()
{
  $('#gamearea').hide();

  var seconds_left = 3;
  showStatus('You Won :D Next game will start in....'+ seconds_left + ' seconds');
  var interval = setInterval(function() {
    showStatus('You Won :D Next game will start in....'+ --seconds_left + ' seconds');
    if (seconds_left <= 0)
    {
       getNewGame('/won');
       clearInterval(interval);
    }
  }, 1000);
}

function getNewGame(url)
{
  $.getJSON($SCRIPT_ROOT + url, {
      },
      function(data) {
      //  game_timer.runTimer();
        word = data.word;
        hint = data.hint;
        $('#score').text(data.score);
        prepareNewGame();
      });
      return false;
}

function hangman()
{
  drawNext(++deadStatus);
  //if the status is right leg, the game is lost
  if (deadStatus == RIGHT_LEG)
  {
    //code for game lost
    return gameLost();
  }
}

function gameLost()
{
  drawNext(++deadStatus);

  $('#gamearea').hide();

  var seconds_left = 3;
  showStatus('You Lost :( Next game will start in....'+ seconds_left + ' seconds');
  var interval = setInterval(function() {
    showStatus('You Lost :( Next game will start in....'+ --seconds_left + ' seconds');
    if (seconds_left <= 0)
    {
       getNewGame('/lost');
       clearInterval(interval);
    }
  }, 1000);
}

function showStatus(message)
{
  $('#status').text(message);
  $('#status').show();
}

function disableAllAlphabets()
{
  $('.alphabet').addClass("disabled");
}

function drawNext(deadStatus)
{
  $('#hangman').attr("src","static/images/" + deadStatus + ".png");
}

function populateBlanks()
{
  $('#ans').empty();
  for(var i=0;i<word.length;i++)
  {
    var element = $('<span>');
    element.attr('id','blank'+i);
    element.text("__");
    $('#ans').append(element);
  }
}

$(document).ready(main);
