import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ExplorerComponent} from "./components/explorer/explorer.component";
import {ImprintComponent} from "./components/imprint/imprint.component";
import {EditorComponent} from "./components/editor/editor.component";
import {APP_BASE_HREF} from "@angular/common";

const routes: Routes = [
    { path: '', redirectTo: '/explorer', pathMatch: 'full' },
    { path: 'explorer', component: ExplorerComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'imprint', component: ImprintComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppRoutingModule {
}