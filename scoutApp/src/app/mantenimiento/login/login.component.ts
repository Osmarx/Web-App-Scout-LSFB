import { Component, OnInit,Input} from '@angular/core';
//import {User} from '../models/user';
import { FormControl, FormGroup } from '@angular/forms';
import {UserService} from '../services/user.service'
import { TokenService } from '../services/token.service'
import { Token} from '../models/token'
import { UserData} from '../models/user'
import * as bcrypt from 'bcryptjs';

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
    mail: new FormControl('scoutlsfb@gmail.com'),
    password: new FormControl('badenpowellLSFB'),
  });
  userData: UserData
  
  

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


    const salt = bcrypt.genSaltSync();
    
    this.loginForm.value.password =bcrypt.hashSync(this.loginForm.value.password, 10);
   
    

    this._userService.Login(this.loginForm.value).subscribe(
      (response) => {   
                              
        this.showDeveloperMode= true
        this.islogIn = true
        localStorage.setItem('isLogin',String(this.islogIn))

        this.userData = response.body

        

        
        this.tokenService.getToken(this.userData).subscribe((res) => {
          this.token = res.body
          
          localStorage.setItem('Token',this.token.access_token)
          })

        localStorage.setItem('Data User',JSON.stringify(this.userData))
      
      },
      (error) => {                            
        this.messageError = error.error
        this.isHidden= true
       
        localStorage.setItem('Data User','Usted no está logeado')
      }
    )
  }

 
    
    



}
