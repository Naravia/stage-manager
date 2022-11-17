import { bindable, inject } from "aurelia-framework"
import { AppState } from "./AppState";

@inject(AppState)
export class Navigation {
  @bindable title;
  @bindable router;

  constructor(appState) {
    this.appState = appState;
  }

  navLinks() {
    const isAuth = !!this.appState.user;
    const links = this.router.navigation.filter(link => {
      if (link.settings.show === 'auth') {
        return isAuth;
      }
      if (link.settings.show === 'noauth') {
        return !isAuth;
      }
      return true;
    });
    return links;
  }
}
