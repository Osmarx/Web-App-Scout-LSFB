import { Component, OnInit,Input} from '@angular/core';
//import {User} from '../models/user';
import { FormControl, FormGroup } from '@angular/forms';
import {UserService} from '../services/user.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  showLogOutButton: boolean;
  messageError: string;
  islogIn: boolean;
  isHidden = false;
  showDeveloperMode: boolean;
  loginForm = new FormGroup({
    mail: new FormControl('ogonzalez@esinel.cl'),
    password: new FormControl('123abc'),
  });
  

  constructor(private _userService: UserService) {

  }

 

  ngOnInit(): void {

    if(localStorage.getItem('isLogin')=="true"){
      this.showDeveloperMode = true
      this.showLogOutButton = true
    }else{
        this.showDeveloperMode = false
        this.showLogOutButton = false
    }

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
        
    /* this._userService.getToken(this.loginForm.value).subscribe(res =>{
      console.log(res.body)
    }) */
    
    this._userService.signUp(this.loginForm.value).subscribe(
      (response) => {                           
        localStorage.setItem('user', JSON.stringify(response.body));
        this.showDeveloperMode= true
        this.islogIn = true
        localStorage.setItem('isLogin',String(this.islogIn))
        
        console.log(this.loginForm.value)
        
        var dataToken = {
          username: this.loginForm.value.mail,
          password: this.loginForm.value.password

        }

        console.log(dataToken)

       this._userService.getToken(dataToken).subscribe((res)=>{
            console.log(res)
        }) 



      },
      (error) => {                            
        this.messageError = error.error
        this.isHidden= true
        console.error(error.error)
      }
    )
  }

 
    
    



}
