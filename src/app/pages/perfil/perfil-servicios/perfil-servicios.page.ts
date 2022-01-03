import { Component, OnInit } from '@angular/core';

import { LocalStorageService, GlobalService, ProfesionalServicioService } from '../../../providers/';

@Component({
  selector: 'app-perfil-servicios',
  templateUrl: './perfil-servicios.page.html',
  styleUrls: ['./perfil-servicios.page.scss'],
})
export class PerfilServiciosPage implements OnInit {

  servicios: any[] =[];

  constructor( public globalServ: GlobalService,
               private ls: LocalStorageService,
               private profesionalServicioService: ProfesionalServicioService ) { }

  ngOnInit() {

    this.ls.getStoreData("profesional").then( data => {
      
      const profesional: any = data;

      this.listarServicios(profesional.id);
    }); 

  }

  listarServicios( id: number ) {
    this.profesionalServicioService.list( id ).subscribe( data => {
      const profesionalServicios: any = data;      

      profesionalServicios.data.forEach(element => {
        this.servicios.push(element.servicio);        
      });
    });
  }



}
