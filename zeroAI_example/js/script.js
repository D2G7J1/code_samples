// what player is currently playing
let currentTurn = 'player1';
//array representing how many plays have been made in each column
let stacks = [0,0,0,0];
// the actual turn number
let turn = 1;
// is there a winner?
let winner = false;
//boolean enforce if inputs are locked out or not
let lockout = false;
//array that holds the turn/play history
let turnHistory = [];
//array to hold the ai
let ai = [];

//when all content is loaded
document.addEventListener("DOMContentLoaded", function(){
    //declare variables to represent the game board
    let gameBoard = Array.from(document.querySelectorAll('.gameCell'));
    let gameColumn0 = [gameBoard[0],gameBoard[4],gameBoard[8],gameBoard[12]];
    let gameColumn1 = [gameBoard[1],gameBoard[5],gameBoard[9],gameBoard[13]];
    let gameColumn2 = [gameBoard[2],gameBoard[6],gameBoard[10],gameBoard[14]];
    let gameColumn3 = [gameBoard[3],gameBoard[7],gameBoard[11],gameBoard[15]];

    //load the ai into the array, set up like this for future expansion: i.e the ai plays itself
    ai.push(new Zero());

    // check if a winning play was made
    function checkWin(winLine){
        //the number of cells in a winning line that match the color of the current players turn
        let checkCount = 0;

        //check each winning line 
        for(cell of winLine){
            //if a cell in the winning line matches the color of the current players turn
            if(gameBoard[cell].classList.contains(currentTurn)){
                //add to the count of cells
                checkCount++;
            }
        }

        //if the count of cells is three or more and a winner hasn't already been declared
        if(checkCount >= 3 && !winner){
            // lock the inputs
            lockout = true;
            // show the reset game button
            document.querySelector('aside').style.display = 'block';
            // declare the winner
            winner = currentTurn;
            // highlight the winning cells green by adding the winning class
            for(cell of winLine){
                gameBoard[cell].classList.remove(currentTurn);
                gameBoard[cell].classList.add('winner');
            }
            // change the h1 to the show the winning player
            document.querySelector('h1').innerText = `${winner} wins`;
        }
    }


    //function to play a piece on the board
    function playPiece(column){
        //if the inputs are not locked out
        if(!lockout){

            //add the current play to the turn history
            turnHistory.push(column);

            //update the stacks to reflect the play
            if(column == 0 && stacks[0] <= 4){
                gameColumn0[stacks[0]].classList.add(currentTurn);
                stacks[0]++;
            }else if(column == 1 && stacks[1] <= 4){
                gameColumn1[stacks[1]].classList.add(currentTurn);
                stacks[1]++;
            }else if(column == 2 && stacks[2] <= 4){
                gameColumn2[stacks[2]].classList.add(currentTurn);
                stacks[2]++;
            }else if(column == 3 && stacks[2] <= 4){
                gameColumn3[stacks[3]].classList.add(currentTurn);
                stacks[3]++;
            }
    
            //check every line for a win
            for(line of winningLines){
                checkWin(line);
            }
    
            //if it is the ai's turn update the current player and turn
            if(currentTurn == 'player1'){
                currentTurn = 'player2';
                turn = turn+2;
            //if it is the player's turn and no one has won
            }else if(!winner){
                currentTurn = 'player1';

                //ai compares current state to it's knowledge base and updates accordingly
                ai[0].process(turn,turnHistory);
                //ai plays a piece taking in the turn and history
                playPiece(ai[0].play(turn,turnHistory));
            }
        }
    }

    //function to reset the game board 
    function resetGame(){
        //reset the game cells to be empty
        for(cell of gameBoard){
            cell.classList.remove('player1');
            cell.classList.remove('player2');
            cell.classList.remove('winner');
        }
        
        // if player 2 wins
        if(winner == "player2"){
            ai[0].learn(turn,turnHistory,false);
            console.log("learning");
        // if the ai wins
        }else{
            ai[0].learn(turn,turnHistory,true);
        }

        //reset to defaults
        stacks = [0,0,0,0];
        document.querySelector('aside').style.display = 'none';
        lockout = false;
        winner = false;
        turn = 1;
        currentTurn = 'player1';
        turnHistory = [];
        document.querySelector('h1').innerText = ``;
        ai[0].process(turn,turnHistory);  
        //make the first move again
        playPiece(ai[0].play(turn,turnHistory));  
    }

    // add event listeners to play and reset buttons
    document.querySelector('#column0').addEventListener("click", function(){
        playPiece(0);
    });
    document.querySelector('#column1').addEventListener("click", function(){
        playPiece(1);
    });
    document.querySelector('#column2').addEventListener("click", function(){
        playPiece(2);
    });
    document.querySelector('#column3').addEventListener("click", function(){
        playPiece(3);
    });
    document.querySelector('aside').addEventListener("click", function(){
        resetGame();
    });

    //make the first move
    ai[0].process(turn,turnHistory);
    playPiece(ai[0].play(turn,turnHistory));
})