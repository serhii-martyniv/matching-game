export class Timer {
  #currentTime;
  deadline;
  #timerElement;
  timeLeft;
  timeInterval;
  timerPaused = false;

  constructor() {
    this.#timerElement = document.getElementById("timer");
  }

  getDeadline() {
    return Date.parse(this.deadline) - Date.parse(new Date());
  }
  getTimePaused() {
    return this.timerPaused;
  }

  getTimeRemaining() {
    const timeDiff = Date.parse(this.deadline) - Date.parse(new Date());
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);

    return {
      total: timeDiff,
      minutes: minutes,
      seconds: seconds,
    };
  }

  start(timeLimit, callback) {
    this.#currentTime = Date.parse(new Date());
    this.deadline = new Date(this.#currentTime + timeLimit * 60 * 1000);
    this.run(callback);
  }

  resetPaused() {
    this.timerPaused = false;
  }

  run(callback = () => {}) {
    this.resetPaused();
    const update = () => {
      const timeLeft = this.getTimeRemaining();
      const minutes =
        timeLeft.minutes < 10 ? "0" + timeLeft.minutes : timeLeft.minutes;
      const seconds =
        timeLeft.seconds < 10 ? "0" + timeLeft.seconds : timeLeft.seconds;
      this.#timerElement.innerHTML = `<span id="clock">${minutes}: ${seconds}`;

      if (timeLeft.total <= 0) {
        clearInterval(this.timeInterval);
        callback();
      }
    };

    update();
    this.timeInterval = setInterval(update, 1000);
  }

  pause() {
    if (!this.timerPaused) {
      this.timerPaused = true;
      clearInterval(this.timeInterval);
      this.timeLeft = this.getTimeRemaining().total;
    }
  }

  resume() {
    if (this.timerPaused) {
      this.timerPaused = false;
      this.deadline = new Date(Date.parse(new Date()) + this.timeLeft);
      this.run();
    }
  }
}
