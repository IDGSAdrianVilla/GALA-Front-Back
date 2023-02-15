import { Component } from '@angular/core';

interface Item {
  name: string;
  checked: boolean;
  children?: Item[];
}
@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css']
})
export class UsuariosRegistroComponent {

  items: Item[] = [
    {
      name: 'Reportes',
      checked: false,
      children: [
        {
          name: 'Lectura',
          checked: false
        },
        {
          name: 'Escritura / Modificación',
          checked: false
        }
      ]
    },
    {
      name: 'Usuarios',
      checked: false,
      children: [
        {
          name: 'Lectura',
          checked: false
        },
        {
          name: 'Escritura / Modificación',
          checked: false
        }
      ]
    },
    {
      name: 'Cátalogos',
      checked: false,
      children: [
        {
          name: 'Lectura',
          checked: false
        },
        {
          name: 'Escritura / Modificación',
          checked: false
        }
      ]
    }
  ];

  check(item: Item, checked: boolean): void {
    item.checked = checked;

    if (item.children) {
      item.children.forEach(child => {
        child.checked = checked;
      });
    }

    if (item.checked) {
      this.checkParent(item);
    } else {
      this.uncheckParent(item);
    }
  }

  checkParent(item: Item): void {
    if (item.children) {
      const parent = item.children[0].checkedElement.parentElement.parentElement.parentElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      const allChecked = item.children.every(child => child.checked);
      parent.checked = allChecked;
      this.checkParent({ ...item, checkedElement: parent });
    }
  }

  uncheckParent(item: Item): void {
    if (item.checkedElement) {
      const parent = item.checkedElement.parentElement.parentElement.parentElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      parent.checked = false;
      this.uncheckParent({ ...item, checkedElement: parent });
    }
  }

}
