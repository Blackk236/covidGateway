import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPersonne, Personne } from '../personne.model';
import { PersonneService } from '../service/personne.service';

@Component({
  selector: 'jhi-personne-update',
  templateUrl: './personne-update.component.html',
})
export class PersonneUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    tests: [null, [Validators.required]],
    importes: [null, [Validators.required]],
    positifs: [null, [Validators.required]],
    deces: [null, [Validators.required]],
    gueris: [null, [Validators.required]],
    date: [null, [Validators.required]],
  });

  constructor(protected personneService: PersonneService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personne }) => {
      this.updateForm(personne);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const personne = this.createFromForm();
    if (personne.id !== undefined) {
      this.subscribeToSaveResponse(this.personneService.update(personne));
    } else {
      this.subscribeToSaveResponse(this.personneService.create(personne));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonne>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(personne: IPersonne): void {
    this.editForm.patchValue({
      id: personne.id,
      tests: personne.tests,
      importes: personne.importes,
      positifs: personne.positifs,
      deces: personne.deces,
      gueris: personne.gueris,
      date: personne.date,
    });
  }

  protected createFromForm(): IPersonne {
    return {
      ...new Personne(),
      id: this.editForm.get(['id'])!.value,
      tests: this.editForm.get(['tests'])!.value,
      importes: this.editForm.get(['importes'])!.value,
      positifs: this.editForm.get(['positifs'])!.value,
      deces: this.editForm.get(['deces'])!.value,
      gueris: this.editForm.get(['gueris'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
