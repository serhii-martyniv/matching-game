import { Cell } from "../cell";
import { Popup } from "../popup";
import { Button } from "../button";
import { shuffleNumbers, setStyles } from "../utils";
import { Timer } from "../timer";

export class MatchGrid {
  #grid;
  #cellData = [];
  #timer;
  #button;
  #popup;
  #timeIsOverTimeoutId;
  #openedCellsNumber = 0;
  #isTimePreview;

  constructor(matchesLimit, width, height, columns, rows, timeGmeLimit, timePreviewLimit) {
    this.matchesLimit = matchesLimit;
    this.width = width;
    this.height = height;
    this.columns = columns;
    this.rows = rows;
    this.timeGmeLimit = timeGmeLimit;
    this.timePreviewLimit = timePreviewLimit;
    this.#isTimePreview = false;

    this.#grid = document.getElementById("gridGame");
    this.#button = new Button();
    this.#timer = new Timer();
    this.#popup = new Popup(this.#grid);

    this.#onStartButtonClick();
    this.#onClick();
    this.#onMouseLeave();
    this.#restartGame();
  }

  init() {
    this.#addCellsToGrid();
    setStyles(this.#grid, this.width, this.height, this.columns, this.rows);
  }

  #onStartButtonClick() {
    const buttonStart = this.#button.getButtonStart();
    this.#isTimePreview = true;
    const startGame = () => {
      this.#grid.classList.add('cardPreview');
      this.#timer.start(this.timePreviewLimit, () => {
        this.#isTimePreview = false;
        this.#grid.classList.remove('cardPreview');
        this.#timer.start(this.timeGmeLimit);
        this.#timeIsOut();
      });
      this.#button.disableButtonStart();
      this.#grid.style.pointerEvents = "all";
    };

    buttonStart.addEventListener("click", startGame);
  }

  #addCellsToGrid() {
    const shuffled = shuffleNumbers(this.matchesLimit);

    shuffled.forEach((el, index) => {
      const cell = new Cell(el, index);

      this.#grid.insertAdjacentHTML("afterbegin", cell.create());
    });
  }

  #resetCardData() {
    this.#cellData = [];
  }

  #manageCells(e) {
    if (this.#isTimePreview || !e.target.offsetParent || !e.target.offsetParent.attributes.meta)
      return;

    const { offsetParent } = e.target;
    const cellValue = offsetParent.attributes.meta.value;
    const cellId = offsetParent.id;
    const cellElement = offsetParent;

    Cell.flip(cellElement, false);

    if (this.#cellData[0] && this.#cellData[0].cellId === cellId) {
      Cell.flip(cellElement, true);
      this.#cellData = [];
      return;
    }

    this.#cellData.push({ cellValue, cellId, cellElement });

    if (this.#cellData.length === 2) this.#checkMatchNumbers();
  }

  #checkMatchNumbers() {
    const [cell1, cell2] = this.#cellData;

    if (cell1.cellValue === cell2.cellValue) {
      this.#countMatched();
      this.#cellData.forEach((item) => {
        document.getElementById(item.cellId).style.pointerEvents = "none";
      });
      this.#resetCardData();

      return;
    }

    setTimeout(() => {
      this.#cellData.forEach((item) => {
        Cell.flip(document.getElementById(item.cellId), true);
      });
      this.#resetCardData();
    }, 600);
  }

  #onClick() {
    this.#grid.addEventListener("click", this.#manageCells.bind(this));
  }

  #addResumeButton() {
    const markup = this.#button.getButtonResume();
    this.#grid.insertAdjacentHTML("afterbegin", markup);
    const buttonContinue = document.getElementById("buttonContinue");

    const resumeGame = () => {
      this.#timer.resume();

      buttonContinue.remove();
      this.#grid.style.pointerEvents = "all";
      this.#timeIsOut();
    };

    buttonContinue.addEventListener("click", resumeGame);
  }

  #timeIsOut() {
    const timerDeadline = this.#timer.getDeadline();
    clearTimeout(this.#timeIsOverTimeoutId);
    this.#timeIsOverTimeoutId = setTimeout(() => {
      this.#grid.style.pointerEvents = "none";
      this.#popup.createPopup("Time is up try again");
    }, timerDeadline);
  }

  #restartGame() {
    const restartButton = this.#button.getButtonRestart();
    const newGrid = () => {
      while (this.#grid.lastElementChild) {
        this.#grid.removeChild(this.#grid.lastElementChild);
      }

      clearInterval(this.#timer.timeInterval);
      this.#openedCellsNumber = 0;

      this.init();
      this.#isTimePreview = true;
      this.#grid.classList.add('cardPreview');
      this.#timer.start(this.timePreviewLimit, () => {
        this.#grid.classList.remove('cardPreview');
        this.#isTimePreview = false;
        this.#timer.start(this.timeGmeLimit);
        this.#timeIsOut();
      });
      this.#button.disableButtonStart();
      this.#grid.style.pointerEvents = "all";
    };
    restartButton.addEventListener("click", newGrid);
  }

  #onMouseLeave() {
    this.#grid.addEventListener("mouseleave", (e) => {
      const paused = this.#timer.getTimePaused();
      if (!this.#isTimePreview && e && !paused) {
        this.#timer.pause();
        this.#addResumeButton();
        clearTimeout(this.#timeIsOverTimeoutId);
        this.#grid.style.pointerEvents = "none";
      }
    });
  }

  #countMatched() {
    this.#openedCellsNumber = ++this.#openedCellsNumber;
    if (this.#openedCellsNumber === this.matchesLimit) {
      this.#gameWin();
    }
  }

  #gameWin() {
    this.#timer.pause();
    this.#grid.style.pointerEvents = "none";
    this.#popup.createPopup("Winner, great job!");
    clearTimeout(this.#timeIsOverTimeoutId);
    this.#isTimePreview = false;
  }
}
