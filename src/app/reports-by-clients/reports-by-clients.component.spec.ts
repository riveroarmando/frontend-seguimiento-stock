import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsByClientsComponent } from './reports-by-clients.component';

describe('ReportsByClientsComponent', () => {
  let component: ReportsByClientsComponent;
  let fixture: ComponentFixture<ReportsByClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsByClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsByClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
