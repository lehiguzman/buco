import { Component, OnInit } from '@angular/core';

import { GlobalService, LocalStorageService, CalificacionService } from '../../../providers'

@Component({
  selector: 'app-calificacion-list',
  templateUrl: './calificacion-list.page.html',
  styleUrls: ['./calificacion-list.page.scss'],
})
export class CalificacionListPage implements OnInit {

  calificaciones: any[] = [];

  constructor(public globalService: GlobalService, 
              private ls: LocalStorageService,
              private calificacionService: CalificacionService) { }

  ngOnInit() {
    this.listarCalificaciones();
  }

  listarCalificaciones() {  
    this.ls.getStoreData("profesionalId").then( ( profesionalId: any ) => {
      console.log("Profesional id : ", profesionalId);
      this.calificacionService.list( 1 ).subscribe( ( data: any ) => {
        console.log("Datos de calificaciones : ", data);

        this.calificaciones = data.data;
      });
    });
  }
}
