import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, switchMap, take, tap } from 'rxjs';
import { Candidate } from '../../models/candidate.model';
import { CandidatesService } from '../../services/candidates.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-candidate',
  templateUrl: './single-candidate.component.html',
  styleUrl: './single-candidate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCandidateComponent {
  loading$!: Observable<boolean>;
  candidate$!: Observable<Candidate>;

  constructor(
    private candidatesService: CandidatesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    this.loading$ = this.candidatesService.loading$;
    this.candidate$ = this.route.params.pipe(
      switchMap((params) =>
        this.candidatesService.getCandidateById(+params['id'])
      )
    );
  }

  onGoBack() {
    this.router.navigateByUrl('/reactive-state/candidates');
  }

  onRefuse() {
    this.candidate$
      .pipe(
        take(1),
        tap((candidate) => {
          this.candidatesService.refuseCandidate(candidate.id);
          this.onGoBack();
        })
      )
      .subscribe();
  }

  onHire() {
    throw new Error('Method not implemented.');
  }
}
