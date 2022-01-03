import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// Servicios
import {
  GlobalService, LocalStorageService,
  ServicioService, ProfesionalPreRegistroService
} from '../../../providers';

@Component({
  selector: 'app-datos-especificos',
  templateUrl: './datos-especificos.page.html',
  styleUrls: ['./datos-especificos.page.scss'],
})
export class DatosEspecificosPage implements OnInit {

  formDinamico: any = [];
  servicioID: any = 0;

  constructor(
    private apiServicio: ServicioService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private preRegistroApi: ProfesionalPreRegistroService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.lsServ.getStoreData("preRegistro_servicioPostular").then((servicio: any) => {
      if (servicio) {
        this.servicioID = servicio.id;
        this.globalServ.loadingCustom("Cargando Información...", 9999);
        this.apiServicio.getCamposEspeciales(servicio.id).subscribe((res: any) => {
          const camposDinamicos = res.data;
          if (camposDinamicos.length > 0) {
            let formDina = [];
            for (let index = 0; index < camposDinamicos.length; index++) {
              const campo: any = camposDinamicos[index];
              if (!campo.eliminado) {
                const { clave, nombre, requerido, longitudMinima, longitudMaxima, tipo, opciones } = campo;
                let camposEspeciales: any = { clave, nombre, requerido, longitudMinima, longitudMaxima, tipo, opciones };
                formDina.push({
                  ...camposEspeciales,
                  ...{
                    valor: "",
                    formDinaID: campo.formularioDinamico.id,
                    opciones: this.getOpciones(opciones),
                    multiple: tipo === 'selectmultiple' ? true : false,
                    nombre: requerido ? `${nombre}*` : nombre
                  }
                });
              }
            }
            this.formDinamico = formDina;
            this.globalServ.dismissLoader();
            this.cargarDatosForm();
          } else {
            this.globalServ.mensaje({
              message: `Este Servicio no tiene Datos Específicos configurados.`,
              position: "top", color: "light", duration: 6666
            });
            this.lsServ.setStoreData("preRegistro_datosEspecficos", {})
              .then(() => this.navCtrl.navigateForward("preregistro-home"));
          }
        });
      } else {
        this.globalServ.mensaje({ message: "No se encontró el servicio seleccionado" });
      }
    });
  }
  ionViewWillLeave() {
    // if (this.formInValido()) {
    //   this.lsServ.setStoreData("preRegistro_datosEspecificos", null)
    //     .then(() => this.navCtrl.navigateForward("preregistro-home"));
    // }
  }

  private getOpciones(opciones: any) {
    if (!opciones) return [];
    return opciones.split(";")
  }

  formInValido() {
    let invalido = false;
    const camposR = this.formDinamico.filter(item => item.requerido === true);
    camposR.forEach(ele => {
      const dato = ele.valor;
      if (dato === "" || (Array.isArray(dato) && dato.length === 0)) {
        invalido = true;
      }
    });

    return invalido;
  }

  inputChange(event: any, campo: any) {
    // console.log("inputChange", campo.nombre, event.detail.value)
    const value = event.detail.value;
    this.formDinamico = this.formDinamico.map((item: any) => {
      if (item.clave === campo.clave) {
        item.valor = value;
      }
      return item;
    });
  }

  private cargarDatosForm() {
    this.lsServ.getStoreData("preRegistro_datosEspecificos").then((campos: any) => {
      if (campos) {
        this.formDinamico.map((fd: any, i: number) => {
          const campGuard: any = campos.find((ce: any) => ce.clave === fd.clave);
          if (campGuard && campGuard.valor) {
            if (fd.clave === campGuard.clave) {
              this.formDinamico[i].valor = campGuard.valor;
            }
          }
          return fd;
        });
      }
    });
  }

  registro() {
    this.globalServ.loadingCustom("Guardando Información...", 9999);
    let datos: any = [];
    let datos2: any = [];
    this.formDinamico.forEach((ele: any) => {
      const { clave, nombre, valor, formDinaID } = ele;
      let campos = { clave, nombre, valor, formDinaID };
      datos.push(campos);
      let temp: any = {};
      temp[`${clave}__nombre`] = nombre;
      temp[`${clave}__valor`] = valor;
      temp[`${clave}__formDinaId`] = formDinaID;
      datos2.push(temp);
    });

    this.preRegistroApi.create({ camposEspecificos: datos2, servicioID: this.servicioID }).subscribe((resp: any) => {
      this.globalServ.dismissLoader();
      this.lsServ.setStoreData("preRegistro_datosEspecificos", datos)
        .then(() => this.navCtrl.navigateForward("preregistro-home"));
    });
  }
}
