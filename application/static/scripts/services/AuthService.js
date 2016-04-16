/*
* Class for handling authentication of login/register
 */
class AuthService {

    /* Sends login request to server
    *  Returns error with message if unsuccessful
    */
    login(email, password){
        $.ajax({
            type:"POST",
            //contentType: "application/json; charset=utf-8",
            url: "/login",
            data:{email: email, password: password},
            success: function(data){
                console.log(data.message);
            }
        });
    }


    /* Sends register request to server
     *  Returns error with message if unsuccessful
     */
    register(email, password){

    }
}
export default new AuthService()

