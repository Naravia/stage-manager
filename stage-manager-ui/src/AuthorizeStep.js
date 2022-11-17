import { inject } from 'aurelia-framework';
import { AppState } from "./AppState";

@inject(AppState)
export class AuthorizeStep {
  constructor(appState) {
    this.appState = appState;
  }
  
  run(navigationInstruction, next) {
    console.log('on authorize');
    console.log(this.appState)
    console.log(navigationInstruction.getAllInstructions());
    return next();
  }
}
