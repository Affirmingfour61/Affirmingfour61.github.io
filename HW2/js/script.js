const symbols = [
  {name: "Cherry", img: "img/cherry.jpg"},
  {name: "Star", img: "img/star.jpeg"},
  {name: "Heart", img: "img/heart.webp"}
];

const multipliers = {
  "Cherry": 2,
  "Star": 100,
  "Heart": 10
};

const slotContainer = document.getElementById("slotContainer");
for (let i = 1; i <= 3; i++) {
  const img = document.createElement("img");
  img.id = `slot${i}`;
  img.alt = "";
  slotContainer.appendChild(img);
}
document.getElementById("spinBtn").addEventListener("click", spinSlots);

document.getElementById("resetBtn").addEventListener("click", resetSlots);

function resetSlots() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`slot${i}`).src = "";
    document.getElementById(`slot${i}`).alt = "";
  }
  document.getElementById("resultMessage").innerText = "";
  document.getElementById("winnings").innerText = "";
}

function spinSlots() {

  const betInput = document.getElementById("betAmount");
  const bet = parseFloat(betInput.value);

  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid bet amount!");
    betInput.focus();
    return;
  }

  let results = [];

  for (let i = 0; i < 3; i++) {
    let randomIndex = Math.floor(Math.random() * symbols.length);
    let symbol = symbols[randomIndex];

    results.push(symbol);

    const slotImg = document.getElementById(`slot${i+1}`);
    slotImg.src = symbol.img;
    slotImg.alt = symbol.name;

    console.log(`Slot ${i+1}: ${symbol.name}`);
  }

  if (results[0].name === results[1].name && results[1].name === results[2].name) {
    let winningSymbol = results[0].name;
    let winnings = bet * multipliers[winningSymbol];

    document.getElementById("resultMessage").innerText = ` Winner Winner Winner: ${winningSymbol}s!`;
    document.getElementById("winnings").innerText = `You WON: $${winnings.toFixed(2)}`;


    console.log("Player won!", winnings);
  } else {
    document.getElementById("resultMessage").innerText = " You Lost! Spin Again!";
    document.getElementById("winnings").innerText = "Winnings: $0.00";


    console.log("Player lost.");
  }


}
