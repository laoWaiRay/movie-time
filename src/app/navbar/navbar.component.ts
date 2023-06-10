import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  constructor(private router: Router) {}

  ngOnInit(): void {
    const events = this.router.events.pipe(
      // type predicate to help typescript infer that event is of type NavigationEnd
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )

    events.subscribe((e: NavigationEnd) => {
      // console.log(e.url);
    })
  }
}
