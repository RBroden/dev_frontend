import { Component, NgZone, OnDestroy } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { AngularFire } from 'angularfire2';

import { FirebaseAuthService } from './service/firebaseauth.service';
import { AuthService } from './service/auth.service';
import { AuthModel } from './model/auth.model';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'auth',
    inputs: ['_authModel'],
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.scss'],
    directives: [CORE_DIRECTIVES]
})
export class Auth implements OnDestroy {

    // vars
    private _authModel:AuthModel;
    private _authSubscription;

    // constructor
    constructor(private _af:AngularFire, private _authService:AuthService,
                private _ngZone:NgZone) {
        // init vars
        this._authModel = {isAuthorized:this._authService.isUserAuthorized()};

        // subscribe to auth state
        this._authSubscription = this._authService.emitter$
            .subscribe((isAuthorized) => {
                this._ngZone.run(() => {
                    // log
                    console.log('auth state received: ' + isAuthorized);
                    this.processAuthChange(isAuthorized);
                })
            });
    }

    // on-destroy
    ngOnDestroy() {
        // unsubscribe from auth
        this._authSubscription.unsubscribe();
    }

    public signIn(provider:string):void {
      this._authService.signIn();
    }

    public signOut(provider:string):void {
      this._authService.signOut();
    }

    // process auth changes
    private processAuthChange(isAuthorized:boolean):void {
        // update model
        this._authModel.isAuthorized = isAuthorized;
    }
}
