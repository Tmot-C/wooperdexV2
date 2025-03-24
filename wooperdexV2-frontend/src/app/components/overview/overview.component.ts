import { Component, inject, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../firebase-auth.service';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  
  private authSvc = inject(FirebaseAuthService);
  userdata: any;
 
  ngOnInit(): void {

    this.userdata = this.authSvc.currentUser$;
    this.userdata.subscribe((value: any) => {
      console.log(value);
    });
  }

}
