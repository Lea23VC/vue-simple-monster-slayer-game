function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getHealthBarPercentage(health) {
  if (health <= 0) {
    return { width: '0%' };
  }
  return { width: health + '%' };
}

function whoIsNot(who) {
  if (who === 'player') {
    return 'monster';
  }
  return 'player';
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      logs: [],
      turns: 0,
      winner: null,
    };
  },
  methods: {
    attackMonster() {
      this.turns++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player', 'attack', attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage('monster', 'attack', attackValue);
    },
    specialAttackMonster() {
      this.turns++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player', 'attack', attackValue);
      this.attackPlayer();
    },
    heal() {
      this.turns++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage('player', 'heal', healValue);
      this.attackPlayer();
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.logs = [];
      this.turns = 0;
      this.winner = null;
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      this.logs.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    whoClass(who) {
      switch (who) {
        case 'player':
          return 'log--player';
        case 'monster':
          return 'log--monster';
      }
    },
    actionClass(what) {
      switch (what) {
        case 'attack':
          return 'log--damage';
        case 'heal':
          return 'log--heal';
      }
    },
    logMessage(who, what, value) {
      switch (what) {
        case 'attack':
          return 'hits ' + whoIsNot(who) + ' for ' + value + ' of damage';
        case 'heal':
          return 'heals themself for ' + value;
      }
    },
  },
  computed: {
    playerHealthBarPercentage() {
      return getHealthBarPercentage(this.playerHealth);
    },
    monsterHealthBarPercentage() {
      return getHealthBarPercentage(this.monsterHealth);
    },
    disabledHealButton() {
      return this.playerHealth >= 100;
    },
    disabledAttackButton() {
      return this.playerHealth <= 0 || this.monsterHealth <= 0;
    },
    disabledSpecialAttackButton() {
      return (
        this.turns % 3 != 0 || this.playerHealth <= 0 || this.monsterHealth <= 0
      );
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // Draw
        this.winner = 'draw';
        console.log('draw playerHealth');
      } else if (value <= 0) {
        // Player lost
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // Draw
        console.log('draw monsterHealth');
        this.winner = 'draw';
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'player';
      }
    },
  },
});

app.mount('#game');
