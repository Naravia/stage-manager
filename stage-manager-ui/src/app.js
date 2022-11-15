require('bootstrap/dist/css/bootstrap.min.css')
require('bootstrap')

import { PLATFORM } from "aurelia-framework";

export class App {
  title = 'Stage Runner';
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'home'],       name: 'home',       moduleId: PLATFORM.moduleName('home/index'), nav: true, title: 'Home' },
      { route: ['register'],       name: 'register',       moduleId: PLATFORM.moduleName('auth/register'),nav: true, title: 'Register' },
      { route: ['login'],       name: 'login',       moduleId: PLATFORM.moduleName('auth/login'), nav: true, title: 'Login' },      
      { route: ['running-order'],       name: 'running-order',       moduleId: PLATFORM.moduleName('running-order/index'), nav: true, title: 'Running Order' },            
    ]);
    console.log(router);
  }
}
