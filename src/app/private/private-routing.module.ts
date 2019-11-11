import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PrivateComponent} from './component/private.component';
import {QuestionsComponent} from './component/questions/questions.component';
import {QuizzesComponent} from './component/quizzes/quizzes.component';
import {SubjectsComponent} from './component/subjects/subjects.component';
import {GroupsComponent} from './component/groups/groups.component';

const routes: Routes = [
  { path: 'Home', component: PrivateComponent, children: [
      { path: '', redirectTo: 'Groups', pathMatch: 'full' },
      { path: 'Questions', component: QuestionsComponent},
      { path: 'Quizzes', component: QuizzesComponent },
      { path: 'Subjects', component: SubjectsComponent },
      { path: 'Groups', component: GroupsComponent }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PrivateRoutingModule { }
