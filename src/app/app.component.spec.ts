import {TestBed, async} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {NavigationComponent} from "./components/navigation/navigation.component";
import {AppRoutingModule} from "./app-routing.module";
import {ExplorerModule} from "./components/explorer/explorer.module";
import {ImprintComponent} from "./components/imprint/imprint.component";

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                NavigationComponent,
                ImprintComponent
            ],
            imports: [
                AppRoutingModule,
                ExplorerModule
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
