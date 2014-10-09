/* Define global variables */
//spacing definitions
var initX = 0; //px
var initY = 0; //px
var moveOneUnit = 100; //px
//number of blocks thick for border around goal(1 block thick) 
var minBorderThickness = 1;
//size of gameboard (gameSize x gameSize)
var gameSize = 5;
//size of innerboard (goalSize x goalSize)
var goalSize = gameSize - 2*minBorderThickness; //goal must be within gameboard 
//maximum number of the same color
var maxNumOfColors = gameSize-1;
//gameboard
var board; 
//goal board to match to
var myGoalBoard; 
//colors for blocks
var colors = ['blue','lime','darkviolet','red','yellow','hotpink']
//['#0000FF','#FF0000','#00FF00','#FF00FF','#FFFF00','DarkOrchid']

//set the gameboard size
function setGameSize(n) {
    //set the new gameSize
    gameSize = n;
    //check that the goalSize < gameSize (by at least minimum border thickness)
    while((gameSize-goalSize) < (2*minBorderThicknes)){
        //adjust goalSize to fit with newly assigned gameSize
        goalSize -= 1;
    }
}

//set the goal board size
function setGoalSize(n) {
    //set the new goalSize
    goalSize = n;
    //check that the goalSize < gameSize (by at least minimum border thickness)
    while((gameSize-goalSize) < (2*minBorderThicknes)){
        //adjust gameSize to fit with newly assigned goalSize
        gameSize += 1;
    }
}



//constructor for block
function block(x,y,c) {
    this.posX = x;  //int
    this.posY = y;  //int
    this.color = c; //hex
    this.isBlank=false;
}

//constructor for gameboard
function gameboard() {
    this.gameSize = gameSize; //game grid size
    this.goalSize = goalSize; //goal grid size
    this.blocks = {};  //positions of blocks (block objects)
    this.blank;        //position of the blank block
}


/* Check if game has been won
 * Input: goalboard object, gameboard object
 * Output: Boolean
 */
function gameWon(goalBoard,board) {
    //get inner part of board
    var innerBoard = {}; var x; var y;
    //get thickness of the border (number of blocks)
    var borderSize = (gameSize-goalSize)/2 //should always be an integer
    //go over each part of the inner board
    //note we are ignoring the border completely
    for(x=borderSize; x<=board.goalSize; x++) {
        for(y=borderSize; y<=board.goalSize; y++) {
            innerBoard[x+'_'+y] = board.blocks[x+'_'+y];
        }
    }
    //check if any inner board and goal board blocks don't match 
    for(b in innerBoard) {//b in innerBoard)                    
        if (innerBoard[b].color !== myGoalBoard[b].color)
            return false;
    }
    //game won since we never broke out of the loop
    return true;
}

/* Create goal for inner board
 * Input: none
 * Output: goalBoard object with the size of goalSize-by-goalSize
 */
function createGoalBoard(){        
    //keep count of how many times a color was used (initialized to 0)
    var colorCounts = Array.apply(null, new Array(colors.length))
                           .map(Number.prototype.valueOf,0);
    var x; var y; 
    var goalBoard = Array(goalSize*goalSize);        
    //get thickness of the border (number of blocks)
    var borderSize = (gameSize-goalSize)/2; //should always be an integer
    //go over the goal board using the absolute position in the gameboard
    for(x=borderSize; x<(board.goalSize+borderSize); x++) {
        for(y=borderSize; y<(board.goalSize+borderSize); y++) {
            //randomly get a color
            var cn = Math.floor((Math.random() * colors.length));
            //check that the color hasn't been maxed out
            //not very efficient but should be no problem with small games
            while( colorCounts[cn] >= maxNumOfColors ) {
                //since color was maxed out, try randomly picking again                           
                cn = Math.floor((Math.random() * colors.length));
            }
            //color is usable so count it and assign it to new block
            colorCounts[cn] += 1;
            var blockColor = colors[cn];
            goalBoard[x+'_'+y] = new block(x,y,blockColor);
        }                
    }
    return goalBoard; 
}


//start game setup, return gameboard
function initGame(n) {
    //initiate gameboard
    var myBoard = new gameboard();
    //array of colors for blocks
    //['blue','red','green','purple','yellow']
    //color counts
    var colorCounts = Array.apply(null, new Array(colors.length))
                           .map(Number.prototype.valueOf,0);            
    var max = 4;
    //construct board of blocks
    var x; var y;
    for(x=0; x<n; x++) {
        for(y=0; y<n; y++) {
            if(y===0 && x===n-1) { //top right
                tempBlock = new block(x,y,'white');
                tempBlock.isBlank = true;
                myBoard.blank = tempBlock;
            } 
            else {
                //get a number (corresponding to color) randomly up to max number 
                var cn = Math.floor((Math.random() * colors.length));
                while( colorCounts[cn] >= max ) {                            
                    cn = Math.floor((Math.random() * colors.length));
                }
                colorCounts[cn] += 1;
                var blockColor = colors[cn];
                tempBlock = new block(x,y,blockColor);//colors[(x+y)%6]);                    
            }
            var keyStr = x+'_'+y;
            myBoard.blocks[keyStr] = tempBlock;
        }
    }
    return myBoard;
}

function displayGame() {
    //
    var gameboardDiv = document.getElementById('gameboard');
    //set style for gameboard
    board = initGame(gameSize);
    //create goal board
    myGoalBoard = createGoalBoard();
    var goalDiv = document.getElementById("goal");
    var str = ''; var x; var y; var count=0;
    for(y=1; y<(4); y++) {
        for(x=1; x<(4); x++) {
            if (count%3 == 0) 
                str += '<br/>';
            str += "<float style='border-style:solid;border-width:1px;"
                +  "background:"+myGoalBoard[x+'_'+y].color+";'>"
                +  "&nbsp &nbsp &nbsp" + '</float>';
            count++;
        }
    }
    goalDiv.innerHTML = str;   
    
    //square border thickness
    var squareThick = 1;
    //create inner board's  height and width be a square (not including the edge)
    var innerHeight = moveOneUnit*(gameSize-2);
    var innerWidth  = moveOneUnit*(gameSize-2);
    //inner board thickness
    var innerThick = 8;
    //inner board position (one block in)
    var innerPosX = initX + moveOneUnit-innerThick;
    var innerPosY = initY + moveOneUnit-innerThick;            
    //one block into board
    gameboardDiv.innerHTML = "<div id='innerBoard' "  
                           + "style='height:"+innerHeight+"px;width:"+innerWidth+"px;"
                           + "border-style:solid;border-color:black;"
                           + "border-width:"+(innerThick+squareThick)+"px;"
                           + "position:absolute;left:"+innerPosX+"px;top:"+innerPosY+"px;"
                           + "z-index:1;pointer-events:none;" //send to top (click under
                           + "border-radius: 15px;"
                           + "'>"                                   
                           + "</div>";
    //add in tiles to display
    for (b in board.blocks) { //(myBlock in board.blocks)
        var myBlock = board.blocks[b];
        //left?
        var leftPos = initX + myBlock.posX * moveOneUnit;
        //top 
        var topPos  = initY + myBlock.posY * moveOneUnit;
        //blank?
        var idStr   = (myBlock.isBlank) ? 'blank':myBlock.posX+'_'+myBlock.posY;
        var borderStyle = (myBlock.isBlank) ? 'none':'solid';
        //string for div to be inserted
        var divStr = '<div id=\''+idStr+'\' '
                   + 'style=\'height:100px;width:100px;'
                   + 'background:'+myBlock.color+';'
                   + 'border-style:'+borderStyle+';border-width:'+squareThick+'px;' 
                   + 'position:absolute;'
                   + 'top:'+topPos+'px;'
                   + 'left:'+leftPos+'px;\''
                   + 'onclick="moveToBlank($(this))"'
                   +'></div>';
        gameboardDiv.innerHTML += divStr;
    }
    //return board
    
    return board;
}

function moveBlockTo(blockId,toX,toY) {
    //move block square attributes
    document.getElementById(blockId).id = toX+'_'+toY;
    var selector = $('div#'+toX+'_'+toY);
    //change to positions
    toX = initX + moveOneUnit*toX;
    toY = initY + moveOneUnit*toY;    
    //move block to new position
    selector.animate({left:toX+'px',top:toY+'px'},'fast') 
}

function moveBlank(toX,toY) {        
    //move blank square attributes
    board.blank.posX = toX;
    board.blank.posY = toY;
    //save blank position in game board
    //board.blocks[oldX+'_'+oldY] = board.blank;
    //convert to pixels
    toX = initX + moveOneUnit*toX;
    toY = initY + moveOneUnit*toY;    
    //disappears blank
    return $('div#blank')                                //vanish blank
        .animate({left:toX+'px',top:toY+'px'},'fast')    //move blank to new position
        .animate({opacity:0},'fast')                     //show blank again    
        .promise();                                      //allows methods to check if done
}

//switch blank with click (if applicable)
function moveToBlank(blockSelector) {
    //save old values
    var blockX = parseInt(blockSelector.attr('id')[0]); //first number in block
    var blockY = parseInt(blockSelector.attr('id')[2]); //last number in block
    var blankX = parseInt(board.blank.posX); //first number in blank
    var blankY = parseInt(board.blank.posY); //last number in blank
    //if possible: blank is touching piece

    //test if in left or right of blank
    if( ((blockX===(blankX-1)) && (blockY===blankY)) || //left of blank
        ((blockX===(blankX+1)) && (blockY===blankY)) || //right of blank
        ((blockY===(blankY-1)) && (blockX===blankX)) || //above of blank
        ((blockY===(blankY+1)) && (blockX===blankX))    //below of blank
    )
    {             
        // save a temp of the block
        var tempB = board.blocks[blockX+'_'+blockY];
        //var myTempBlock = new block(tempB.posX,tempB.posY,tempB.color);
        board.blocks['temp'] = new block(tempB.posX,tempB.posY,tempB.color);


        //move piece
        moveBlockTo(blockX+'_'+blockY,blankX,blankY);  
        //
        board.blocks[blankX+'_'+blankY] = board.blocks['temp'];        
        
        //move blank
        moveBlank(blockX,blockY).done(
            //checks if the game is won and presents alert after animation finishes 
            function() { 
                if (gameWon(myGoalBoard,board))
                    alert("YOU WIN!!!\nClick \"Restart Game\" to play again");            
            }
        );
        
        //
        board.blocks[blockX+'_'+blockY] = board.blank;                
        
    }    
}

$(document).ready(displayGame);
