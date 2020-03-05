//Class for Zero AI
class Zero{
    constructor(){
        //array to hold all possible play combinations
        this.actions = [];
        //the last action taken by AI
        this.lastAction = 0;
        //the second last action taken by AI
        this.secondLastAction = 0; 
        //third last action taken by AI
        this.thirdLastAction = 0;
    }

    //function to play turn, takes in what turn it is, and the previous action history
    play(turnNumber, history){
        //set the game state
        let state = this.actions.filter(action => action.turn == `${turnNumber}-${history.join('')}`);
        // choose a random play from the array of play options
        let action = state[0].options[Math.floor(Math.random()*state[0].options.length)];

        //cycle the action history
        this.thirdLastAction = this.secondLastAction;
        this.secondLastAction = this.lastAction;
        this.lastAction = action;

        //return the action
        return action;
    }

    //function to check if the ai has seen the game state before and add new states to it's memory
    process(turnNumber,history){
        //add a boolean for to that represents if the ai has seen the state before;
        let match = false;

        //check if the ai has seen the game current game state before, adjusting the match boolean accordingly
        for(let action of this.actions){
            if(action.turn == `${turnNumber}-${history.join('')}`){
                match = action;
            }
        }

        //if the ai has never seen the state before
        if(!match){
            //array to hold all available play options of the new state
            let legalPlays = [];
            //check how many times a column has been played in and adjust the legal plays accordingly
            //// column 1 and 3 need to be checked against the length of 5 because the ai plays on odd labelled turns
            if((history.join("")).split('0').length < 4){
                legalPlays.push(0);
            }
            if((history.join("")).split('1').length < 5){
                legalPlays.push(1);
            }
            if((history.join("")).split('2').length < 4){
                legalPlays.push(2);
            }
            if((history.join("")).split('3').length < 5){
                legalPlays.push(3);
            }

            //add the state to the memory
            this.actions.push({"turn":`${turnNumber}-${history.join('')}`, "options": legalPlays});
        }        
    }

    //function to adjust available move options, based on winning or losing
    //what turn is it?, what happened to get to this point? was it a winning play?
    learn(turnNumber, history, win){
        
        // if the ai lost
        if(win == false){
            //splice the history and roll back the turn number to reflect the state where the ai made the move that lead to it's lost
            /**
             * Example: the ai plays on turn 5 and the player wins on turn 
             * * The turn will be moved to 7 after the winning move
             * * * In order to get back to the last turn the ai took before it lost; the turnNumber and history needs to go back 2
             */
            history.splice(history.length-2,2);
            turnNumber -= 2;

            //check every possible game state 
            this.actions.forEach(action => {
                //match the game state to the state where the ai made a bad play
                if(action.turn == `${turnNumber}-${history.join('')}` && action.options.length > 1){
                    //remove the option to make the losing play
                    for(let i = 0; i<action.options.length; i++){
                        if(action.options[i] == this.lastAction){
                            action.options.splice(i,1);
                        }
                    }
                //if the available plays are empty on previous play, start changing the play that lead to that state
                }else if (action.turn == `${turnNumber}-${history.join('')}` && action.options.length <= 1){
                    //history -2 because player 2 won, adding an additional history item
                    history.splice(history.length-2,2);
                    turnNumber -= 2;
                    //set all the actions back a stage and rerun the function
                    this.lastAction = this.secondLastAction;
                    this.secondLastAction = this.thirdLastAction;
                    this.thirdLastAction = 0;
                    console.log(`recurse ${turnNumber}-${turnHistory.join('')}`)
                    this.learn(turnNumber,history,win);
                }
            })
        //if the ai won
        }else{
            //go back to the winning play
            history.splice(history.length-1,1);
            turnNumber -= 2;

            //find the game state where the winning play was made
            for(let action of this.actions){
                //if the state has more than one option
                if(action.turn == `${turnNumber}-${history.join('')}` && action.options.length != 1){
                    //set the options to only contain the winning move
                    action.options = [];
                    action.options.push(this.lastAction);
                //if already won in this state run the previous play through the function to always make that play in the future
                }else if(action.turn == `${turnNumber}-${history.join('')}` && action.options.length == 1){
                    //this splice makes the aligns the history to the AI's previous turn before the winning move
                    history.splice(history.length-1,1);
                    this.learn(turnNumber,history,win);        
                }
            }
        }
    }
}