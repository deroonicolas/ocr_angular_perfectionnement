import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  delay,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class CandidatesService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _candidates$ = new BehaviorSubject<Candidate[]>([]);
  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  private lastCandidatesLoad = 0;

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getCandidatesFromServer() {
    if (Date.now() - this.lastCandidatesLoad <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http
      .get<Candidate[]>(`${environment.apiUrl}/candidates`)
      .pipe(
        delay(1000),
        tap((candidates) => {
          this.lastCandidatesLoad = Date.now();
          this._candidates$.next(candidates);
          this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getCandidateById(id: number): Observable<Candidate> {
    if (!this.lastCandidatesLoad) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      map(
        (candidates) => candidates.filter((candidate) => candidate.id === id)[0]
      )
    );
  }

  /**
   * Fonction refuseCandidate(id: number): void
      Cette méthode est utilisée pour refuser un candidat dans une liste en supprimant ses données via une requête HTTP, et ensuite mettre à jour la liste locale des candidats. Elle fait usage de RxJS pour gérer les flux asynchrones.

      1. this.setLoadingStatus(true);
      Cette ligne met à jour le statut de chargement à true. Cela peut être utilisé pour afficher un indicateur de chargement dans l'interface utilisateur pendant que l'opération est en cours.

      2. this.http.delete(${environment.apiUrl}/candidates/${id})
      Une requête HTTP DELETE est envoyée à l'API pour supprimer le candidat spécifié par son id.
      environment.apiUrl est utilisé pour construire l'URL du backend où la suppression sera effectuée.
      3. pipe()
      Le pipe est une méthode qui permet de chaîner plusieurs opérateurs RxJS ensemble pour transformer, filtrer ou gérer le flux des données de l'observable.

      4. delay(1000)
      Ajoute un délai de 1 seconde avant que la suppression soit effectuée. Cela peut être utilisé pour simuler un délai réseau ou donner un retour plus visible à l'utilisateur.

      5. switchMap(() => this.candidates$)
      switchMap : Cet opérateur annule les observables précédentes s'il y en a, et passe à la prochaine observable.
      Ici, il permet d'écouter les changements dans la liste des candidats via this.candidates$ après la suppression réussie du candidat.
      6. take(1)
      Cet opérateur permet de ne prendre que la première émission de la liste des candidats (donc le flux sera automatiquement complété après cela). Cela signifie qu'une seule émission est traitée, après quoi l'observable se termine.

      7. map(candidates => candidates.filter(candidate => candidate.id !== id))
      map : Transforme les données de l'observable.
      Ici, on filtre la liste des candidats pour exclure celui dont l'id correspond à celui qui a été supprimé. Cela permet de mettre à jour la liste des candidats localement après la suppression.
      8. tap(candidates => { ... })
      tap : Permet d'effectuer des actions secondaires sans modifier les données qui passent à travers le flux observable.
      Ce bloc fait deux choses importantes :
      this._candidates$.next(candidates); : Émet la nouvelle liste de candidats (après suppression) via l'objet Subject (ou BehaviorSubject) qui est derrière candidates$. Cela permet à tous les composants abonnés à cette liste d'obtenir la version mise à jour.
      this.setLoadingStatus(false); : Met à jour l'état de chargement à false, indiquant que l'opération est terminée.
      9. .subscribe()
      Finalement, subscribe() lance l'exécution de toute la chaîne observable.
      Sans l'appel à subscribe(), aucun opérateur dans le pipe ne serait exécuté, car les observables RxJS sont "cold", c'est-à-dire qu'elles ne s'exécutent que lorsqu'un abonné est présent.
   */
  refuseCandidate(id: number): void {
    this.setLoadingStatus(true);
    this.http
      .delete(`${environment.apiUrl}/candidates/${id}`)
      .pipe(
        delay(1000),
        switchMap(() => this.candidates$),
        take(1),
        map((candidates) =>
          candidates.filter((candidate) => candidate.id !== id)
        ),
        tap((candidates) => {
          this._candidates$.next(candidates);
          this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  hireCandidate(id: number): void {
    this.candidates$
      .pipe(
        take(1),
        map((candidates) =>
          candidates.map((candidate) =>
            candidate.id === id
              ? { ...candidate, company: 'Snapface Ltd' }
              : candidate
          )
        ),
        tap((updatedCandidates) => this._candidates$.next(updatedCandidates)),
        switchMap((updatedCandidates) =>
          this.http.patch(
            `${environment.apiUrl}/candidates/${id}`,
            updatedCandidates.find((candidate) => candidate.id === id)
          )
        )
      )
      .subscribe();
  }
}
