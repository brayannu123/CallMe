import { Component, OnInit } from '@angular/core';
import {TestdepruebaService} from "../../services/testdeprueba.service";

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.page.html',
  styleUrls: ['./prueba.page.scss'],
  standalone:false
})
export class PruebaPage implements OnInit {

  constructor(private testdeprueba: TestdepruebaService) { }

  ngOnInit() {

  }

  mauriciochismoso(){
    this.testdeprueba.launchJitsiCall()
  }

}
