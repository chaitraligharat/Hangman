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
//
// var game_timer =
//   {
//     timer:null,
//     time_remaining:2
//
//     this.pauseTimer = function() {
//       clearInterval(timer);
//       console.log("Will redirect now");
//     }
//
//     this.resetTimer = function() {
//       time_remaining = 2;
//     }
//
//     displayTimer = function(mm,ss) {
//       $('#time').text(mm + " : "+ ss);
//     }
//
//     runTimer = function() {
//       var end = new Date();
//       end.setMinutes(end.getMinutes() + time_remaining);
//       var start = new Date();
//
//       timer = setInterval(function() {
//         now = new Date();
//         time_remaining = end - now;
//
//         if(time_remaining <= 0)
//         {
//           pauseTimer();
//           console.log('Game ends');
//           return;
//         //  endGame();
//         }
//         var msec = time_remaining;
//         var hh = Math.floor(msec / 1000 / 60 / 60);
//         msec -= hh * 1000 * 60 * 60;
//         var mm = Math.floor(msec / 1000 / 60);
//         msec -= mm * 1000 * 60;
//         var ss = Math.floor(msec / 1000);
//         msec -= ss * 1000;
//         displayTimer(mm,ss);
//       },1000);
//     }
//   };

var main = function() {
  prepareNewGame();
  //game_timer.runTimer();
}

function prepareNewGame()
{
  deadStatus = NONE;
  gameStatus = word.length;
  $('#deadman').show();
  $('#status').hide();

  populateBlanks();
  populateAlphabets();
  $('#hint').text(hint);
}

function showDeadMan()
{

}
//
// function startTimer(limit)
// {
//     var end = new Date();
//     end.setMinutes(end.getMinutes() + limit);
//     var start = new Date();
//
//     timer = setInterval(function() {
//       now = new Date();
//       diff = end - now;
//
//       if(diff <= 0)
//       {
//         clearInterval(timer);
//         console.log("Will redirect now");
//       //  endGame();
//       }
//       var msec = diff;
//       var hh = Math.floor(msec / 1000 / 60 / 60);
//       msec -= hh * 1000 * 60 * 60;
//       var mm = Math.floor(msec / 1000 / 60);
//       msec -= mm * 1000 * 60;
//       var ss = Math.floor(msec / 1000);
//       msec -= ss * 1000;
//
//       $('#time').text(mm + " : "+ ss);
//     },1000);
// }

function endGame()
{
  window.location.replace('/gameEnd');
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
  }
}

function createAlphabet(alphabet)
{
  var element = $('<a>');
  element.text(alphabet);
  element.addClass('alphabet');
  element.attr('href','#');
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
    $('#deadman').hide();
    $('#status').text("You Won!!!!");
    //game won code;
    gameWon();
  }
}

function gameWon()
{
  getNewGame('/won')
}

function getNewGame(url)
{
  $.getJSON($SCRIPT_ROOT + url, {
        word: getSolvedWord()
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

function getSolvedWord()
{
  return 'abc';
}

function hangman()
{
  drawNext(++deadStatus);
  //if the status is right leg, the game is lost
  if (deadStatus == RIGHT_LEG)
  {
    $('#deadman').hide();
    $('#status').text("You Lost!!!!");
    //code for game lost
    return gameLost();
  }
}

function gameLost()
{
  disableAllAlphabets();
  getNewGame('/lost');
}

function disableAllAlphabets()
{
  $('.alphabet').addClass("disabled");
}

function drawNext(deadStatus)
{
  $('#status').text(deadStatus);
  $('#status').show();
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
