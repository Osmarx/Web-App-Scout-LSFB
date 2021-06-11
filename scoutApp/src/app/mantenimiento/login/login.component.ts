import { Component, OnInit,Input} from '@angular/core';
//import {User} from '../models/user';
import { FormControl, FormGroup } from '@angular/forms';
import {UserService} from '../services/user.service'
import { TokenService } from '../services/token.service'
import { Token} from '../models/token'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService,TokenService]
})
export class LoginComponent implements OnInit {
  
  token: Token
  showLogOutButton: boolean;
  messageError: string;
  islogIn: boolean;
  isHidden = false;
  showDeveloperMode: boolean;
  loginForm = new FormGroup({
    mail: new FormControl('ogonzalez@esinel.cl'),
    password: new FormControl('123abc'),
  });

  

  constructor(private _userService: UserService,
    private tokenService: TokenService) {

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
                              
        this.showDeveloperMode= true
        this.islogIn = true
        localStorage.setItem('isLogin',String(this.islogIn))

        var UserDataToken = {
          username: this.loginForm.value.mail,
          password: this.loginForm.value.password
        }
        
        this.tokenService.getToken(UserDataToken).subscribe((res) => {
          this.token = res.body
          localStorage.setItem('Token',this.token.access_token)
          })

        localStorage.setItem('Data User',JSON.stringify(UserDataToken))
      
      },
      (error) => {                            
        this.messageError = error.error
        this.isHidden= true
        console.error(error.error)
        localStorage.setItem('Data User','Usted no está logeado')
      }
    )
  }

 
    
    



}
