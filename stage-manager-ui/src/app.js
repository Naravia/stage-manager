require('bootstrap/dist/css/bootstrap.min.css')
require('bootstrap')

import { PLATFORM } from "aurelia-framework";
import { AuthorizeStep } from "./AuthorizeStep";

export class App {
  title = 'Stage Runner';
  configureRouter(config, router) {
    this.router = router;
    config.title = this.title;
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('home/index'), nav: true, title: 'Home' },
      { route: ['register'], name: 'register', moduleId: PLATFORM.moduleName('auth/register'), nav: true, title: 'Register', settings: {show: 'noauth'} },
      { route: ['login'], name: 'login', moduleId: PLATFORM.moduleName('auth/login'), nav: true, title: 'Login', settings: {show: 'noauth'} },
      { route: ['running-order'], name: 'running-order', moduleId: PLATFORM.moduleName('running-order/index'), nav: true, title: 'Running Order' },
      { route: 'shows', name: 'shows', moduleId: PLATFORM.moduleName('shows/index'), nav: true, title: 'Shows', settings: {show: 'auth', roles: ['admin']}}
    ]);
    console.log(router);
  }
}
