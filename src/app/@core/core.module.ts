import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
} from './utils';

import { ServicesModule } from './services/services.module';
import { environment } from '../../environments/environment';

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...ServicesModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',  
        baseEndpoint: environment.apiUrl,  
        login: {
          endpoint: '/login',  
          method: 'post',
          redirect: {
            success: '/pages/features/users', 
            failure: null,  
          },
          defaultErrors: ['Login failed, please try again.'],
          defaultMessages: ['Login successful!'],
        },
        // register: {
        //   endpoint: '/auth/register',
        //   method: 'post',
        // },
        // logout: {
        //   endpoint: '/auth/logout',
        //   method: 'post',
        // },
        // requestPass: {
        //   endpoint: '/auth/request-pass',
        //   method: 'post',
        // },
        // resetPass: {
        //   endpoint: '/auth/reset-pass',
        //   method: 'post',
        // },
        token: {
          class: NbAuthJWTToken,  
          key: 'jwtoken',  
        },
      }),
    ],
    forms: {
      login: {
        strategy: 'email',
        redirectDelay: 1000, 
        showMessages: {
          success: true,
          error: true,
        },
        socialLinks: [], 
        rememberMe: false, // Remove Remember Me checkbox
        showForgotPasswordLink: false, // Remove Forgot Password
        showRegisterLink: false, // Remove "Don't have an account? Register"
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
