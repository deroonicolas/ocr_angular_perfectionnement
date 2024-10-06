import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveStateRoutingModule } from './reactive-state-routing.module';
import { Routes } from '@angular/router';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { SingleCandidateComponent } from './components/single-candidate/single-candidate.component';
import { CandidatesService } from './services/candidates.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CandidateListComponent, SingleCandidateComponent],
  imports: [CommonModule, ReactiveStateRoutingModule, SharedModule],
  providers: [CandidatesService],
})
export class ReactiveStateModule {
  routes: Routes = [
    { path: 'candidates', component: CandidateListComponent },
    { path: 'candidates/:id', component: SingleCandidateComponent },
    { path: '', pathMatch: 'full', redirectTo: 'candidates' },
  ];
}
