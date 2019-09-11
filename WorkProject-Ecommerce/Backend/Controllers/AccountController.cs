using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WorkProject.Helpers;
using WorkProject.Models;

namespace WorkProject.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;

        private readonly SignInManager<IdentityUser> _signInManager;

        private readonly AppSettings _appSettings;


        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
        }


        [HttpPost("[action]")]
        //inserting new users POST:api/Account/Register
        public async Task<IActionResult> Register([FromBody] RegisterViewModel formdata)
        {
            //will hold all the errors related to registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = formdata.Email,
                UserName = formdata.UserName,
                SecurityStamp = Guid.NewGuid().ToString()

            };

            var result = await _userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded)
            {
                //whenever a user is registered his/her role will be customer by defualt
                await _userManager.AddToRoleAsync(user, "Customer");

                //sending Confirmation email
                
                return Ok(new { email = user.Email, status = 1, userName = user.UserName,message = "Registration Successful" });
            }
            else {

                foreach (var error in result.Errors) {

                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);

                }

            }

            return BadRequest(new JsonResult(errorList));

        }

        //Login Method
        //POST:api/Account/Login
        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel formdata)
        {
            //Get the User from the database

            var user = await _userManager.FindByNameAsync(formdata.UserName);
            var roles = await _userManager.GetRolesAsync(user);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));
            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            if (user != null && await _userManager.CheckPasswordAsync(user, formdata.Password))
            {
                //Confirmation of an email

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, formdata.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.Now.ToString())

                    }),

                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                    Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                };
                //Generate a Token
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, email = user.Email, userName = user.UserName,userRole = roles.FirstOrDefault() });

            }

            // error returned
            ModelState.AddModelError("", "Email/Password was not found");
            return Unauthorized(new { LoginError = "Please Check The Login Credentials - Invallid Email/Password was Entered " });
        }
    }
}