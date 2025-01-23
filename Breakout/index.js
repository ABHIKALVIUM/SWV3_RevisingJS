function goToRules(){
    window.location.href="./rules.html"
}
function startGame(e){
    e.preventDefault();
}
function goToGame(){
    window.location.href="./game.html"
}
let button = document.getElementById("button");
button.onclick = () => {
    let playerName = document.getElementById("player-name").value;
    let playerNickName = document.getElementById("player-nick-name").value;
    if(playerName.trim() === "") {
        alert("Please enter your Name & Nickname to start the game.");
    }
    else{
        let obj = {
            playerName: playerName,
            playerNickName: playerNickName
          };
          localStorage.setItem("nameData",JSON.stringify(obj))
          console.log(obj)
        location.href="./game.html"
    }
}