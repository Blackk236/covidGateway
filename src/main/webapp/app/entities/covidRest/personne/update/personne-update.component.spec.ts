jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PersonneService } from '../service/personne.service';
import { IPersonne, Personne } from '../personne.model';

import { PersonneUpdateComponent } from './personne-update.component';

describe('Component Tests', () => {
  describe('Personne Management Update Component', () => {
    let comp: PersonneUpdateComponent;
    let fixture: ComponentFixture<PersonneUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let personneService: PersonneService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PersonneUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PersonneUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PersonneUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      personneService = TestBed.inject(PersonneService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const personne: IPersonne = { id: 456 };

        activatedRoute.data = of({ personne });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(personne));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const personne = { id: 123 };
        spyOn(personneService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ personne });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: personne }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(personneService.update).toHaveBeenCalledWith(personne);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const personne = new Personne();
        spyOn(personneService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ personne });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: personne }));
        saveSubject.complete();

        // THEN
        expect(personneService.create).toHaveBeenCalledWith(personne);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const personne = { id: 123 };
        spyOn(personneService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ personne });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(personneService.update).toHaveBeenCalledWith(personne);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
