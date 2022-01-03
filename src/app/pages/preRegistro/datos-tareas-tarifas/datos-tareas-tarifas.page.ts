import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// Servicios
import {
  GlobalService, LocalStorageService,
  ServicioService, ProfesionalPreRegistroService
} from '../../../providers';

@Component({
  selector: 'app-datos-tareas-tarifas',
  templateUrl: './datos-tareas-tarifas.page.html',
  styleUrls: ['./datos-tareas-tarifas.page.scss'],
})
export class DatosTareasTarifasPage implements OnInit {

  formDinamico: any = [];
  servicioID: any = 0;
  servicio: any = {
    nombre: "",
    descripcion: ""
  };

  constructor(
    private servicioApi: ServicioService,
    private lsServ: LocalStorageService,
    private navCtrl: NavController,
    private preRegistroApi: ProfesionalPreRegistroService,
    public globalServ: GlobalService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.lsServ.getStoreData("preRegistro_servicioPostular").then((servicio: any) => {
      if (servicio) {
        this.servicio = { ...this.servicio, ...servicio };
        console.log(this.servicio)
        this.servicioID = servicio.id;
        this.globalServ.loadingCustom("Cargando Información...", 9999);
        this.servicioApi.getTareas(servicio.id).subscribe((res: any) => {
          console.log("Tareas : ", res);
          this.globalServ.dismissLoader();
          if (res.data) {
            const camposDinamicos = res.data;
            if (camposDinamicos.length > 0) {
              let formDina = [];
              for (let index = 0; index < camposDinamicos.length; index++) {
                const campo: any = camposDinamicos[index];
                if (!campo.eliminado) {
                  const { nombre, descripcion, tarifaMinima, tarifaMaxima } = campo;
                  let camposEspeciales: any = { nombre, descripcion, tarifaMinima, tarifaMaxima };
                  formDina.push({
                    ...camposEspeciales,
                    ...{
                      isChecked: false,
                      valor: 0,
                      tareaID: campo.id,
                    }
                  });
                }
              }
              this.formDinamico = formDina;
              this.cargarDatosForm();
            }
          }
        });
      } else {
        this.globalServ.mensaje({ message: "No se encontró el servicio seleccionado" });
      }
    });
  }
  ionViewWillLeave() {
    // if (this.formInValido()) {
    //   this.lsServ.setStoreData("preRegistro_tareasTarifas", null)
    //     .then(() => this.navCtrl.navigateForward("preregistro-home"));
    // }
  }

  formInValido() {
    let invalido = true;
    this.formDinamico.forEach(ele => {
      if (ele.isChecked) {
        const montoCorrecto = (ele.valor >= ele.tarifaMinima && ele.valor <= ele.tarifaMaxima);
        if (invalido && montoCorrecto) {
          invalido = false;
        }
      }
    });

    return invalido;
  }

  inputChange(event: any, campo: any, i: any) {
    // console.log("inputChange", campo.nombre, event.detail.value)
    if (event.detail.value) {
      const value = event.detail.value;
      this.formDinamico[i].valor = value;
    }
  }

  checkboxChange(event: any, i: any) {
    const checked = event.detail.checked;
    this.formDinamico[i].isChecked = checked;
    if (!checked) this.formDinamico[i].valor = 0;
  }

  private cargarDatosForm() {
    this.lsServ.getStoreData("preRegistro_tareasTarifas").then((campos: any) => {
      console.log("preRegistro_tareasTarifas", campos)
      if (campos) {
        this.formDinamico.map((fd: any, i: number) => {
          console.log("formDinamico", fd)
          const campGuard: any = campos.find((ca: any) => ca.tareaID === fd.tareaID);
          if (campGuard && fd.tareaID === campGuard.tareaID) {
            this.formDinamico[i] = { ...fd, ...campGuard };
          }
          return fd;
        });
      }
    });
  }

  registro() {
    this.globalServ.loadingCustom("Guardando Información...", 9999);
    let datos: any = this.formDinamico.filter(item => item.isChecked);
    // this.formDinamico.forEach((ele: any) => {
    //   if (ele.isChecked) {
    //     datos.push(ele);
    //   }
    // });

    this.preRegistroApi.create({ tareasTarifas: datos, servicioID: this.servicioID }).subscribe(() => {
      this.globalServ.dismissLoader();
      this.lsServ.setStoreData("preRegistro_tareasTarifas", datos)
        .then(() => this.navCtrl.navigateForward("preregistro-home"));
    });
  }
}
