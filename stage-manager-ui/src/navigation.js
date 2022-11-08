import{bindable}from "aurelia-framework"
export class Navigation {
  @bindable title;
  constructor(title){
    this.title = title;
  }
}
