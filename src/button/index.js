export class Button {
  buttonStart;
  buttonRestart;
  buttonResume;

  constructor() {
    this.buttonStart = document.getElementById("buttonStart");
    this.buttonRestart = document.getElementById("buttonRestart");

    this.buttonResume = document.createElement('button');
    this.buttonResume.className = 'buttonContinue btn';
    this.buttonResume.id = 'buttonContinue';
    this.buttonResume.innerText = 'Continue';
  }

  getButtonStart() {
    return this.buttonStart;
  }

  getButtonRestart() {
    return this.buttonRestart;
  }

  getButtonResume() {
    return this.buttonResume.outerHTML;
  }

  disableButtonStart() {
    this.buttonStart.setAttribute("disabled", "true");
  }
}
