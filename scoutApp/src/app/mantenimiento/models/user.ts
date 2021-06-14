export interface User{
    body: UserData

}

export interface UserData{
    _id: object;
    mail: string;
    password: string;
}