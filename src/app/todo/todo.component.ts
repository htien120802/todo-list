import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITask } from '../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  taskForm!: FormGroup;
  todo: ITask[] = [];
  inprogress: ITask[] = [];
  done: ITask[] = [];
  updateId!: any;
  isEditEnable: boolean = false;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      item: ['', Validators.required],
    });
    let json = localStorage.getItem('todo');
    if (json != null && typeof json === 'string') {
      this.todo = JSON.parse(json);
    }
    json = localStorage.getItem('inprogress');
    if (json != null && typeof json === 'string') {
      this.inprogress = JSON.parse(json);
    }
    json = localStorage.getItem('done');
    if (json != null && typeof json === 'string') {
      this.done = JSON.parse(json);
    }
  }

  addTask() {
    this.todo.push({
      description: this.taskForm.value.item,
    });
    this.taskForm.reset();
    localStorage.setItem('todo', JSON.stringify(this.todo));
  }

  saveTask() {
    this.todo[this.updateId].description = this.taskForm.value.item;
    this.taskForm.reset();
    this.updateId = undefined;
    this.isEditEnable = false;
    localStorage.setItem('todo', JSON.stringify(this.todo));
  }

  deleteInTodo(i: number) {
    this.todo.splice(i, 1);
    localStorage.setItem('todo', JSON.stringify(this.todo));
  }

  deleteInInprogress(i: number) {
    this.inprogress.splice(i, 1);
    localStorage.setItem('inprogress', JSON.stringify(this.inprogress));
  }

  deleteInDone(i: number) {
    this.done.splice(i, 1);
    localStorage.setItem('done', JSON.stringify(this.done));
  }

  onEdit(item: ITask, i: number) {
    this.taskForm.controls['item'].setValue(item.description);
    this.updateId = i;
    this.isEditEnable = true;
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    localStorage.setItem('todo', JSON.stringify(this.todo));
    localStorage.setItem('inprogress', JSON.stringify(this.inprogress));
    localStorage.setItem('done', JSON.stringify(this.done));
  }
}
