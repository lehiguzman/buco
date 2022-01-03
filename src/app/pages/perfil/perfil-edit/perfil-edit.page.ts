import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

import { NavController } from '@ionic/angular';
import { LocalStorageService, GlobalService, UsuarioService } from '../../../providers/';



import * as moment from 'moment';

@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil-edit.page.html',
  styleUrls: ['./perfil-edit.page.scss'],
})
export class PerfilEditPage implements OnInit {  

  id: number;
  registroForm: FormGroup;
  accion: string = "Actualizar";
  nombreArchivo: string;
  archivo: any;

  constructor( private lsServ: LocalStorageService,
               public globalServ: GlobalService,
               private navCtrl: NavController,
               private usuarioService: UsuarioService,
               public formBuilder: FormBuilder ) { }

  ngOnInit() { 
    this.registroForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      genero: ['1', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],   
      ruta: ['', [Validators.required]],               
    });
  }

  ionViewDidEnter() { 
    this.lsServ.getActiveUser().then( ( usuario ) => {
      console.log("Datos de usuario : ", usuario);   
      
      this.cargarForm( usuario );
    });    
  }

  cargarForm( usuario: any ) {
    
    this.id = usuario.id;
    const genero = usuario.genero || usuario.user.genero;

    this.registroForm.setValue({
      name: usuario.nombre || usuario.name || usuario.user.name,
      genero: String(genero),
      fechaNacimiento: usuario.fechaNacimiento,   
      ruta: null   
    });
  }

  transformarArchivo(e: any) {
    const fileReader = new FileReader();    
    this.nombreArchivo = e.target.files[0].name.toLowerCase();   

    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      this.globalServ.loadingCustom("cargando...").then( () => {
        this.archivo = fileReader.result;
      });      
    }
  }

  actualizar() {

    const form = this.registroForm.value;
    
    if( !form.fechaNacimiento ) {
      const msg = "Debe seleccionar fecha de nacimiento";
      this.globalServ.mensaje({ message: msg, color: 'warning', position: 'middle' });
      return false;
    }

    form.fechaNacimiento = moment(form.fechaNacimiento).format('YYYY-MM-DD');  
    form.archivo = String(this.archivo);   
    form.nombreArchivo = this.nombreArchivo;        

    this.usuarioService.update( this.id, form ).subscribe( ( data: any ) => {      
      console.log("Datos de respuesta : ", data);
      if (data.code == 200 || data.code == 201) {
        this.globalServ.mensaje({ message: data.message, color: 'success', position: 'middle' });
        this.lsServ.setActiveUser(data.data);
        this.navCtrl.navigateForward("perfil");
      }
    });
  }
}
