import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './component/private.component';
import {PrivateRoutingModule} from './private-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { QuestionsComponent } from './component/questions/questions.component';
import { QuizzesComponent } from './component/quizzes/quizzes.component';
import { SubjectsComponent } from './component/subjects/subjects.component';
import { GroupsComponent } from './component/groups/groups.component';

@NgModule({
  declarations: [PrivateComponent, NavbarComponent, QuestionsComponent, QuizzesComponent, SubjectsComponent, GroupsComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
