import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FlightFiltersComponent } from './flight-filters.component';

describe('FlightFiltersComponent', () => {
  let fixture: ComponentFixture<FlightFiltersComponent>;
  let component: FlightFiltersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightFiltersComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightFiltersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filters', {
      maxPrice: null,
      sortBy: 'price',
    });
    fixture.detectChanges();
  });

  it('syncs the input filters into the form without emitting changes', () => {
    const emitSpy = spyOn(component.filtersChange, 'emit');

    fixture.componentRef.setInput('filters', {
      maxPrice: 180,
      sortBy: 'duration',
    });
    fixture.detectChanges();

    expect(component.filtersForm.getRawValue()).toEqual({
      maxPrice: 180,
      sortBy: 'duration',
    });
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emits debounced filter changes', fakeAsync(() => {
    const emitSpy = spyOn(component.filtersChange, 'emit');

    component.filtersForm.controls.maxPrice.setValue(120);
    tick(299);
    expect(emitSpy).not.toHaveBeenCalled();

    tick(1);
    expect(emitSpy).toHaveBeenCalledOnceWith({
      maxPrice: 120,
      sortBy: 'price',
    });
  }));
});
