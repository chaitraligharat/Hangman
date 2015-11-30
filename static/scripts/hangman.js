var NONE=0;
var HEAD = 1;
var BODY = 2;
var LEFT_HAND = 3;
var RIGHT_HAND = 4;
var LEFT_LEG = 5;
var RIGHT_LEG = 6;

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var deadStatus = NONE;
var gameStatus = word.length;

var main = function() {
  populateBlanks();
  populateAlphabets();
  $('#hint').text(hint);
}

function populateAlphabets()
{
  var alphaContainer = $('#alpha-container')
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

  //link is not disabled. Check if the alphabet is present in the word.
  var letter = $(alphabet).text();

  var index = word.indexOf(letter);

  var found = 0;
  if(index == -1)
  {
    hangman();
  }

  while (index != -1)
  {
    //word contains the letter. Change the innerHTML of the blank to letter.
    $('#blank'+index).text(letter);

    //set next index to the next alphabet.
    index = word.indexOf(letter, index + 1);

    found++;
  }

  //disable link
  $(alphabet).addClass("disabled");

  updateProgress(found);
}

function updateProgress(found)
{
  gameStatus = gameStatus - found;
  if(gameStatus == 0)
  {
    $('#deadman').text("You Won!!!!");
    //game won code;
    gameWon();
  }
}

function gameWon()
{
  console.log("Game won!!");
  $.getJSON($SCRIPT_ROOT + '/won', {
        word: 'ABC'
      },
      function(data) {
        //$("#result").text(data.result);
        console.log(data.status);
        console.log("Got response");
        if(data.status == 1)
        {
          $('#start-new-game').show();
          alert("This should work!");
        }
      });
      return false;
    }

function hangman()
{
  drawNext(++deadStatus);
  //if the status is right leg, the game is lost
  if (deadStatus == RIGHT_LEG)
  {
    $('#deadman').text("You Lost!!!!");
    console.log("You lost!!!");
    //code for game lost
    gameLost();
  }
}

function gameLost()
{
  disableAllAlphabets();
}

function disableAllAlphabets()
{
  $('.alphabet').addClass("disabled");
}

function drawNext(deadStatus)
{
  console.log("Drawing the next body part" + deadStatus);
  $('#deadman').text(deadStatus);
}

function populateBlanks()
{
  for(var i=0;i<word.length;i++)
  {
    var element = $('<span>');
    element.attr('id','blank'+i);
    element.text("__");
    $('#ans').append(element);
  }
}

$(document).ready(main);
