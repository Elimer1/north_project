export const battleAlgo = (sentSoldiers, defendingSoldiers) => {
  const attackLuck = 0.6 + Math.random() * 0.4;
  const defenseLuck = 0.6 + Math.random() * 0.4;

  const attackPower = sentSoldiers * attackLuck;
  const defensePower = defendingSoldiers * defenseLuck;

  if (attackPower > defensePower) {
    const survivors = Math.max(
      1,
      Math.ceil((sentSoldiers * (attackPower - defensePower)) / attackPower),
    );
    return { winner: "attacker", soldiers: survivors };
  } else {
    const survivorsDef = Math.max(
      1,
      Math.ceil(
        (defendingSoldiers * (defensePower - attackPower)) / defensePower,
      ),
    );
    return { winner: "defender", soldierSurvivors: survivorsDef };
  }
};

const chooseReinforecment = (gameMap) => {
  let lowestPlayerList = [];
  let lowestList = [];
  let lowest = 100;
  let lowestComputer = 100;
  lowestId = -1;
  lowestBorderP = 100;
  lowestBorderListP = [];
  gameMap.map((territory) => {
    if (territory.owner === "player") {
      if (
        territory.distanceFromComputerHQ &&
        territory.distanceFromComputerHQ < lowest
      ) {
        lowest = territory.distanceFromComputerHQ;
        lowestId = territory.id;
      }
    }
  });

  gameMap.map((territory) => {
    if (territory.id === lowestId) {
      lowestList = territory.neighbors;
    }
  });

  if (lowest > 2) {
    gameMap.map((territory) => {
      if (lowestList.includes(territory.id)) {
        if (territory.distanceFromPlayerHQ < lowestBorderP) {
          lowestBorderP = territory.distanceFromPlayerHQ;
          lowestBorderListP = [[territory.id, territory.soldiers]];
        } else if (territory.distanceFromPlayerHQ === lowestBorderP) {
          lowestBorderListP.push([territory.id, territory.soldiers]);
        }
      }
      if (lowestBorderListP.length === 1) {
        return lowestBorderListP[0];
      } else {
        let sl = [];
        let sc = 0;
        lowestBorderListP.map((item) => {
          if (item[1] > sc) {
          }
        });
      }
    });
  }
};
