

  let total = 0;
  
  
  let scoreSection = document.querySelector(".score");
  let timeSpan = scoreSection.querySelector("#timeTotal");
  let totalSpan = scoreSection.querySelector("#scoreTotal");
  let seasonName = scoreSection.querySelector("#seasonName");
  let seasonTime = scoreSection.querySelector("#seasonTime");
  let MissionsRow= document.querySelector("#missions_")

  let playAgainBtn = document.querySelector("#play_again");
  let RotateBtn = document.querySelector("#rotate");
  let MirrorBtn = document.querySelector("#mirror");
  let clickedCellPosition = { row: 0, col: 0 };
  let processed_shape=[]
  let selectedMissions = []; // Array to store selected missions
  let activeMissionIndices = []; // Array to hold indices of active missions
  let currentSeason=0

  let GridLock = document.querySelector("#grid");
  let bottomDrag = document.querySelector("#dragger2")
  bottomDrag.setAttribute('draggable', 'true')
  let draggableElements;
  let droppableElements;
 let grid = [];
  let inGameTime = 28;
  GridLock.style.opacity = 1;
  scoreSection.style.opacity = 1;
  bottomDrag.style.opacity=1;

  const seasons = ["Spring", "Summer", "Autumn", "Winter"];

  function getSeasonAndTime(time) {
      let seasonIndex = Math.floor((28 - time) / 7);
      let seasonTimenum1 = 7 - ((28 - time) % 7);
      return { season: seasons[seasonIndex], seasonTimenum: seasonTimenum1 };
  }
  
  function updateSeasonDisplay() {
    let { season, seasonTimenum } = getSeasonAndTime(inGameTime);
  
    
    seasonName.innerText = `Season: ${season}`;
    seasonTime.innerText = `Time left in season: ${seasonTimenum}`;
   if (currentSeason!=season) {
    if (inGameTime<28) calculateAndUpdateScore() 
      const seasonIndex = seasons.indexOf(season);
      updateActiveMissions(seasonIndex); // Update active missions based on the season
     
  }
  currentSeason=season; 
}
  function updateActiveMissions(seasonIndex) {
    // Reset all missions to inactive
    document.querySelectorAll('.infant-pair').forEach(div => {
      div.classList.remove('active-mission');
    });
  
    // Activate the appropriate missions
    activeMissionIndices = [(seasonIndex + 1) % 4, seasonIndex]; 
    activeMissionIndices.forEach(index => {
      const missionDiv = document.querySelector(`[data-mission-index="${index}"]`);
      if (missionDiv) {
        missionDiv.classList.add('active-mission');
      }
    });
  }
  


  const mountainPositions = [
    [1, 1], [3, 8], [5, 3], [8, 9], [9, 5] // Adjusted for 0 index
  ];
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  return array
  }
  let current_element=-1
  function calculate_current_element() {
    current_element=(current_element+1)%16
  }
  RotateBtn.addEventListener("click", function(event){
    elements[current_element].rotation=(elements[current_element].rotation+1)%4
    createNewDraggableShape()
  })
  MirrorBtn.addEventListener("click", function(event) {
    elements[current_element].mirrored=elements[current_element].mirrored==true ? false : true 
    createNewDraggableShape()
  })
  function rotateMatrix(matrix, rotation) {
    for (let r = 0; r < rotation; r++) {
        matrix = matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
    }
    return matrix;
}

function mirrorMatrix(matrix) {
    return matrix.map(row => row.slice().reverse());
}

function createNewDraggableShape() {
  clear(bottomDrag);
  const element = elements[current_element];
  // Create a copy of the shape to avoid modifying the original
  processed_shape = JSON.parse(JSON.stringify(element.shape));

  // Apply rotation and mirroring
  processed_shape = rotateMatrix(processed_shape, element.rotation);
  if (element.mirrored) {
      processed_shape = mirrorMatrix(processed_shape);
  }

  // Construct the draggable shape
  for (let i = 0; i < processed_shape.length; i++) {
      var rowDiv = document.createElement('div');
      rowDiv.className = 'baby-pair';
      bottomDrag.appendChild(rowDiv);
      for (let j = 0; j < processed_shape[i].length; j++) {
          let cell = document.createElement('span');
          rowDiv.appendChild(cell);
          cell.classList.add('cell');
          if (processed_shape[i][j]) {
              cell.classList.add(`${element.type}`);
          }

          // Using closure to capture current i, j values
          (function(row, col) {
              cell.addEventListener('mousedown', function(event) {
                  clickedCellPosition = { row, col };
              });
          })(i, j);
      }
  }
}

function updateInGameTime() {
  if (inGameTime <= 0) {
      inGameTime = 0; // Ensure time doesn't go negative
  } 
  setTimeout(() => {
      scoreSection.style.opacity = 0;

  }, 100);
   updateSeasonDisplay(); // Update season information

  setTimeout(() => {
      timeSpan.innerText = `Remaining time: ${inGameTime}`;
      scoreSection.style.opacity = 1;
  }, 300);
}


function cleanSlate() {
  inGameTime = 28;
  updateInGameTime()
  calculate_current_element()
  grid=[]
  total=0;
  totalSpan.innerText = `Score: ${total}`;
 // updateSeasonDisplay(); // Initial season display

} 
  shuffle(elements)
  cleanSlate()
  initiateGame();
  function initiateGame() {

    displayMissions(getRandomMissions())
    updateInGameTime()
    updateActiveMissions(0)
    // Create "griddy" and append to DOM
    for(let i=0; i<11; i++) {
      const row1=[]
      var row = document.createElement('div');
      row.className='griddies';
      GridLock.appendChild(row)
      for (let j=0; j<11; j++) {
        cell=document.createElement('span');
        row.appendChild(cell)
        cell.classList.add('cell')
        row1.push(cell)
        cell.setAttribute('data-x', i)
        cell.setAttribute('data-y', j)
      //  cell.scored = { row: false, column: false };

        if (mountainPositions.some(position => position[0] === i && position[1] === j)) {
          cell.classList.add('mountain'); // Add 'mountain' class if it's a mountain
        } else {
          cell.classList.add('basic');
          cell.classList.add('droppable'); // Add 'droppable' class if it's not a mountain
        /*cell.setAttribute('data-brand', alphabeticallySortedRandomDroppableBrands[0].iconName); 
*/
      } }
grid.push(row1)
    }
    //create draggable shape
    //bottomDrag.classList.add('draggable')
    createNewDraggableShape();

    
    droppableElements = GridLock.querySelectorAll(".cell"); 
  /*      droppableElements = document.querySelectorAll(".droppable"); */
    
    
    droppableElements.forEach(elem => {
      elem.addEventListener("dragenter", dragEnter);
      elem.addEventListener("dragover", dragOver);
      elem.addEventListener("dragleave", dragLeave);
      elem.addEventListener("drop", handleDrop);
    });
  }
  
 
  
  function dragEnter(event) {
    if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
      event.target.classList.add("droppable-hover");
   }
  }
  
  function dragOver(event) {
    if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
      event.preventDefault();
    }
  }
  
  function dragLeave(event) {
    if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
      event.target.classList.remove("droppable-hover");
    }
  }
  
  // Other Event Listeners
  playAgainBtn.addEventListener("click", playAgainBtnClick);
  function playAgainBtnClick() {
    
    // Remove entrance effect
    playAgainBtn.classList.remove("play_again-entrance");



 
    GridLock.style.opacity = 0;
    scoreSection.style.opacity = 0;
    bottomDrag.style.opacity=0;
    // After a brief delay, clear the elements and restart the game
    setTimeout(() => {
        // Clear draggable items and grid
      clear(GridLock)
       

        // Update display
       cleanSlate()

        // Make elements visible again
        GridLock.style.opacity = 1;
        scoreSection.style.opacity = 1;
        bottomDrag.style.opacity=1;

        // Hide the play again button
        playAgainBtn.style.display = "none";
        RotateBtn.style.display = "block"; // Show the play again button
        MirrorBtn.style.display="block"
        timeSpan.style.opacity= 1
         seasonName.style.opacity=1
          seasonTime.style.opacity=1

         // Initiate a new game session
         initiateGame();
    }, 500); 
}
  


  function isValidDrop(targetCell, clickedCellPosition) {
    // Calculate the grid position from the target cell, adjusted for the clicked cell's position
    let targetPos = {
      x: parseInt(targetCell.dataset.x, 10) - clickedCellPosition.row,
      y: parseInt(targetCell.dataset.y, 10) - clickedCellPosition.col
    };
    let shape = processed_shape;
  
    // Check if all parts of the shape can be placed
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] === 1) {
          let x = targetPos.x + i;
          let y = targetPos.y + j;
  
          // Check bounds
          if (x >= 11 || y >= 11 || x < 0 || y < 0) {
            return false;
          }
  
          // Check if cell is available (not a mountain, not already filled)
          if (grid[x][y].classList.contains('mountain') || grid[x][y].classList.contains('dropped')) {
            return false;
          }
        }
      }
    }
    return true;
  }
  

function handleDrop(event) {
  event.preventDefault();
  let targetCell = event.target.closest('.cell'); // Get the closest .cell parent
  
  if (isValidDrop(targetCell, clickedCellPosition)) {
    // If drop is valid, place the shape
    placeShape(targetCell, clickedCellPosition);
  } 
}

function placeShape(targetCell, clickedCellPosition) {
  let targetPos = {
    x: parseInt(targetCell.dataset.x, 10) - clickedCellPosition.row,
    y: parseInt(targetCell.dataset.y, 10) - clickedCellPosition.col
  };
  let shape = processed_shape;

  // Place shape on grid
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        let x = targetPos.x + i;
        let y = targetPos.y + j;

        // Add the 'dropped' class and remove the 'basic' class
        grid[x][y].classList.add('dropped', `${elements[current_element].type}`);
        grid[x][y].classList.remove('basic');
      }
    }
  }
  inGameTime -= elements[current_element].time;
  updateInGameTime()
  elements[current_element].mirrored=false
  elements[current_element].rotation=0
  
  if (inGameTime<=0) { 
 
    ShowPlayButton()
  //  calculateAndUpdateScore();
    return;}
  calculate_current_element();
  createNewDraggableShape();
//  updateSeasonDisplay(); // Update season after placing a shape

}



function calculateAndUpdateScore() {
  let score = 0;
  let score2=0;
 

  activeMissionIndices.forEach(index => {
    const missionTitle = selectedMissions[index].title;
    switch (missionTitle) {
      case "Edge of the forest":
        score2= checkEdgeOfTheForest()
        break;
      case "Sleepy valley":
        score2= checkSleepyValley()
        break;
        case "Watering potatoes":
          score2= checkWateringPotatoes()
          break;
          case "Borderlands":
            score2 = checkBorderlands();
            break;
            case "Tree line":
              score2 = checkTreeline();
              break;
              case "Watering canal":
                score2 = checkWateringCanal();
                break;
                case "Wealthy town":
                  score2 = checkWealthyTown();
                  break;
                  case "Magicians' valley":
                    score2 = checkMagiciansValley();
                    break;
                    case "Empty site":
                      score2 = checkEmptySite();
                      break;
                      case "Row of houses":
                        score2 = checkRowOfHouses();
                        break;
                        case "Odd numbered silos":
                          score2 = checkOddNumberedSilos();
                          break;
                          case "Rich countryside":
                            score2 = checkRichCountryside();
                            break;
                            case "Encircle mountain":
                              score2 = checkEncircleMountain();
                              break;
                    
    }
    selectedMissions[index].div.innerText=score2+parseInt(selectedMissions[index].div.innerText)
    score += score2;
    console.log(`Mission: ${selectedMissions[index].title}, score: ${score2}`)
  });

  // Update total score
  total += score;
  totalSpan.innerText = `Score: ${total}`;
}
function checkBorderlands() {
  let borderlandsScore = 0;
  for (let i = 0; i < 11; i++) {
    if (isRowComplete(i)) borderlandsScore += 6; // Add points for each complete row
    if (isColumnComplete(i)) borderlandsScore += 6; // Add points for each complete column
  }
  return borderlandsScore;
}

function isRowComplete(rowIndex) {
  for (let i = 0; i < 11; i++) {
      let cell = grid[rowIndex][i];
      if (!cell.classList.contains('dropped') && !cell.classList.contains('mountain')) {
          return false; // If any cell in the row is neither dropped nor a mountain, row is not complete
      }
  }
  return true;
}


function isColumnComplete(colIndex) {
  for (let i = 0; i < 11; i++) {
      let cell = grid[i][colIndex];
      if (!cell.classList.contains('dropped') && !cell.classList.contains('mountain')) {
          return false; // If any cell in the column is neither dropped nor a mountain, column is not complete
      }
  }
  return true;
}
function ShowPlayButton() {
clear(bottomDrag)
  
playAgainBtn.style.display = "block"; // Show the play again button
playAgainBtn.classList.add('play_again-entrance') 
RotateBtn.style.display = "none"; // 
MirrorBtn.style.display="none"
timeSpan.style.opacity=0
seasonName.style.opacity=0
seasonTime.style.opacity=0
for (let i = 0; i < 4; i++) {
  selectedMissions[i].div.classList.remove('active-mission')
  
}
}


function clear(element) {
  while (element.firstChild) element.removeChild(element.firstChild);

}

function getRandomMissions() {
  const allMissions = [...shuffle(missions.basic), ...shuffle(missions.extra)];
   selectedMissions = [];
  while (selectedMissions.length < 4) {
    const randomIndex = Math.floor(Math.random() * allMissions.length);
    const mission = allMissions[randomIndex];
    if (!selectedMissions.includes(mission)) {
      selectedMissions.push(mission);
    }
  }
  
}

function convertToCamelCase(str) {
  return str
    // Replace non-alphanumerical characters with space
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    // Remove empty strings from array
    .filter(word => word.trim() !== '')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}


function displayMissions() {
  clear(MissionsRow);
  selectedMissions.forEach((mission, index) => {
    const missionDiv = document.createElement('div');
    missionDiv.classList.add(`${convertToCamelCase(mission.title)}`, 'infant-pair');
    missionDiv.setAttribute('data-mission-index', index); // Add an identifier
    missionDiv.innerText=0
    MissionsRow.appendChild(missionDiv);
    mission.div=missionDiv
  });
}

function checkEdgeOfTheForest() {
  let score = 0;

  // Check top and bottom rows
  for (let x = 0; x < grid.length; x++) {
    if (grid[0][x].classList.contains('forest')) score++;
    if (grid[grid.length - 1][x].classList.contains('forest')) score++;
  }

  // Check left and right columns (excluding already checked corners)
  for (let y = 1; y < grid.length - 1; y++) {
    if (grid[y][0].classList.contains('forest')) score++;
    if (grid[y][grid[0].length - 1].classList.contains('forest')) score++;
  }

  return score;
}
function checkSleepyValley() {
  let score = 0;

  // Iterate through each row
  grid.forEach(row => {
    let forestCount = row.reduce((count, cell) => cell.classList.contains('forest') ? count + 1 : count, 0);
    
    // Check if the row has exactly three forest fields
    if (forestCount == 3) {
      score += 4;
    }
  });

  return score;
}

function checkWateringPotatoes() {
  let score = 0;

  // Function to check if a specific cell is a farm
  const isFarm = (x, y) => {
      if (x < 0 || y < 0 || x >= grid.length || y >= grid[x].length) return false;
      return grid[x][y].classList.contains('farm');
  };

  // Iterate through each cell in the grid
  for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
          // Check if the current cell is water
          if (grid[i][j].classList.contains('water')) {
              // Check adjacent cells for farms
              if (isFarm(i-1, j) || isFarm(i+1, j) || isFarm(i, j-1) || isFarm(i, j+1)) {
                  score += 2; // Add two points for each water field adjacent to a farm
              }
          }
      }
  }

  return score;
}

function checkTreeline() {
  let longestTreeLine = 0;

  for (let col = 0; col < 11; col++) {
    let currentLength = 0;
    let maxCurrentColLength = 0;

    for (let row = 0; row < 11; row++) {
      if (grid[row][col].classList.contains('forest')) {
        currentLength += 1;
        maxCurrentColLength = Math.max(maxCurrentColLength, currentLength);
      } else {
        currentLength = 0; // Reset when the continuous line is broken
      }
    }

    longestTreeLine = Math.max(longestTreeLine, maxCurrentColLength);
  }

  return longestTreeLine * 2; // 2 points for each field in the longest tree line
}

function checkWateringCanal() {
  let score = 0;

  for (let col = 0; col < 11; col++) {
    let farmCount = 0;
    let waterCount = 0;

    for (let row = 0; row < 11; row++) {
      if (grid[row][col].classList.contains('farm')) {
        farmCount++;
      }
      if (grid[row][col].classList.contains('water')) {
        waterCount++;
      }
    }

    if (farmCount === waterCount && farmCount > 0) {
      score += 4; // Add 4 points for each column that meets the criteria
    }
  }

  return score;
}

function checkWealthyTown() {
  let score = 0;

  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      if (grid[i][j].classList.contains('town')) {
        if (isAdjacentToThreeDifferentTerrains(i, j)) {
          score += 3;
        }
      }
    }
  }

  return score;
}

function isAdjacentToThreeDifferentTerrains(x, y) {
  let adjacentTerrains = new Set();

  // Checking up, down, left, and right cells
 // if (x > 0 && !grid[x-1][y].classList.contains('town')) adjacentTerrains.add(getTerrainType(grid[x-1][y]));
  //if (x < 10 && !grid[x+1][y].classList.contains('town')) adjacentTerrains.add(getTerrainType(grid[x+1][y]));
  //if (y > 0 && !grid[x][y-1].classList.contains('town')) adjacentTerrains.add(getTerrainType(grid[x][y-1]));
//  if (y < 10 && !grid[x][y+1].classList.contains('town')) adjacentTerrains.add(getTerrainType(grid[x][y+1]));
  if (x > 0) adjacentTerrains.add(getTerrainType(grid[x-1][y]));
  if (x < 10) adjacentTerrains.add(getTerrainType(grid[x+1][y]));
  if (y > 0) adjacentTerrains.add(getTerrainType(grid[x][y-1]));
  if (y < 10) adjacentTerrains.add(getTerrainType(grid[x][y+1]));
  return adjacentTerrains.size >= 3;
}

function getTerrainType(cell) {

  return ['basic', 'forest', 'mountain', 'farm', 'water'].find(terrain => cell.classList.contains(terrain));
}

function checkMagiciansValley() {
  let score = 0;

  for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
      if (grid[i][j].classList.contains('water')) {
        if (isAdjacentTo(i, j, 'mountain')) {
          score += 3;
        }
      }
    }
  }

  return score;
}

function isAdjacentTo(x, y, terrain) {
  // Check all adjacent cells (up, down, left, right)
  if (x > 0 && grid[x-1][y].classList.contains(`${terrain}`)) return true;
  if (x < 10 && grid[x+1][y].classList.contains(`${terrain}`)) return true;
  if (y > 0 && grid[x][y-1].classList.contains(`${terrain}`)) return true;
  if (y < 10 && grid[x][y+1].classList.contains(`${terrain}`)) return true;

  return false;
}

function checkEmptySite() {
  let score = 0;

  for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
          if (grid[i][j].classList.contains('basic')) {
              if (isAdjacentTo(i, j, 'town')) {
                  score += 2;
              }
          }
      }
  }

  return score;
}

function checkRowOfHouses() {
  let longestLineLength = 0;
  let countOfLongestLines = 0;

  // Iterate through each row
  for (let i = 0; i < 11; i++) {
      let currentLineLength = 0;

      for (let j = 0; j < 11; j++) {
          if (grid[i][j].classList.contains('town')) {
              currentLineLength++;
          } else {
              // Update longestLineLength and countOfLongestLines when the line ends
              if (currentLineLength === longestLineLength) {
                  countOfLongestLines++;
              } else if (currentLineLength > longestLineLength) {
                  longestLineLength = currentLineLength;
                  countOfLongestLines = 1;
              }
              currentLineLength = 0;
          }
      }

      // Check for the line at the end of the row
      if (currentLineLength === longestLineLength) {
          countOfLongestLines++;
      } else if (currentLineLength > longestLineLength) {
          longestLineLength = currentLineLength;
          countOfLongestLines = 1;
      }
  }

  return longestLineLength * 2 * countOfLongestLines; // 2 points for each field in all longest lines
}

function checkOddNumberedSilos() {
  let score = 0;

  // Iterate through each column
  for (let col = 0; col < 11; col+=2) {
      let isFullColumn = true;

      for (let row = 0; row < 11; row++) {
          if (grid[row][col].classList.contains('basic')) {
              isFullColumn = false;
              break;
          }
      }

      // Check if the column is full 
      if (isFullColumn) {
          score += 10;
      }
  }

  return score;
}


function checkRichCountryside() {
  let score = 0;

  // Iterate through each row
  for (let i = 0; i < grid.length; i++) {
      let row = grid[i];
      let terrainTypes = new Set();

      // Iterate through each cell in the row
      for (let cell of row) {
         
              // Add the type to the set
              terrainTypes.add(Array.from(cell.classList).find(cls => cls == 'water' || cls == 'forest' || cls == 'basic' || cls == 'mountain' || cls == 'town' || cls == 'farm'));
          
      }

      // Check if there are at least five different terrain types
      if (terrainTypes.size >= 5) {
          score += 4;
      }
  }

  return score;
}

function checkEncircleMountain() {
  let score = 0;

  // Function to check if a cell is surrounded by non-empty fields
  function isMountainEncircled(x, y) {
      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue; // Skip the mountain cell itself

              let checkX = x + i;
              let checkY = y + j;

              // Check bounds
              if (checkX < 0 || checkX >= 11 || checkY < 0 || checkY >= 11) return false;

              // Check if the surrounding cell is empty
              if (grid[checkX][checkY].classList.contains('basic')) return false;
          }
      }
      return true;
  }

  // Iterate through each cell to find mountains
  for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
          if (grid[i][j].classList.contains('mountain')) {
              if (isMountainEncircled(i, j)) {
                  score += 1;
              }
          }
      }
  }

  return score;
}










