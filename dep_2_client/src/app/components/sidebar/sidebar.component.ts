import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
    { path: '/beneficiary', title: 'User Profile',  icon:'person', class: '' }
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    toggle: boolean;
    constructor() { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.toggleOff();
    }
    toggleOff() {
        $('.sidebar-wrapper').css('width', '85px');
        $('.sidebar').css('width', '85px');
        $('.main-panel').css('width', '90%');
        $('.logo').css('height', '10%');
    }
   
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
}

// fixtoggle() {
//     alert('dfsd');
//     $(this).unbind('hover');
//     // $('.sidebar-wrapper').css('pointer-events', 'none');
//     // // $('.sidebar').css('pointer-events', 'none');
//     // $('.main-panel').css('pointer-events', 'none');
//     this.toggle = true
// }

// // mousehover() {
// //     // alert('open')
// //     // this.toggle = 'false'
// //     $('.sidebar-wrapper').css('width', '240px');
// //     $('.sidebar').css('width', '240px');
// //     $('.main-panel').css('width', '80%');
// //     $('.logo').css('height', '10%');

// // }
// toggleoffed () {
//     alert('mouseleave');
//     this.toggle = false;
//     $(document.body).css('pointer-events', '');
//     $('.toggleOn').css('display', 'none');
//     $('.sidebar-wrapper').css('width', '85px');
//     $('.sidebar').css('width', '87px');
//     $('.main-panel').css('width', '90%');
//     $('.logo').css('height', '10%');
// }